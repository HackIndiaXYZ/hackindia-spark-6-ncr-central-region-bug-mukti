import time
import os
import json
from flask import Flask, render_template, Response, jsonify, request
from flask_cors import CORS
import cv2
import numpy as np
import base64
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort

app = Flask(__name__)
CORS(app)

# Load YOLO model
model = YOLO("yolov8n.pt")
vehicle_classes = [2, 3, 5, 7]

# Global state for dashboard
violation_count = 0
violation_ids = set()
recent_violations = []

# Global state for client-side processing
client_tracker = DeepSort(max_age=30)
client_track_history = {}
client_violation_ids = set()

VIOLATIONS_FILE = os.path.join('static', 'violations.json')
os.makedirs('static', exist_ok=True)

if os.path.exists(VIOLATIONS_FILE):
    try:
        with open(VIOLATIONS_FILE, 'r') as f:
            recent_violations = json.load(f)
            violation_count = len(recent_violations)
            for v in recent_violations:
                if v['id'].startswith('V-'):
                    try:
                        violation_ids.add(int(v['id'].replace('V-', '')))
                    except:
                        pass
    except Exception as e:
        print(f"Error loading violations: {e}")

def generate_frames(source="videos/sample.mp4"):
    global violation_count, violation_ids, recent_violations
    
    # Check if the source is meant to be an integer (camera index)
    try:
        source = int(source)
    except ValueError:
        pass
        
    cap = cv2.VideoCapture(source)
    
    # Apply lag mitigation
    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_delay = 1.0 / fps
    
    # Initialize history and tracker inside the generator 
    # so they reset properly if the video loops
    track_history = {}
    tracker = DeepSort(max_age=30)

    while True:
        start_time = time.time()
        
        # When BUFFERSIZE=1, grab() multiple times to ensure we get the latest frame
        # Only needed for live feeds (integer sources)
        if isinstance(source, int):
            cap.grab()
        
        ret, frame = cap.read()
        
        if not ret:
            if isinstance(source, str):
                # Loop the video and clear tracking states, but DO NOT CLEAR persistent violations
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                violation_ids.clear()
                track_history.clear()
                tracker = DeepSort(max_age=30)
                continue
            else:
                break

        # Resize for performance optimization
        frame = cv2.resize(frame, (640, 480))

        # Run YOLO detection
        results = model(frame, conf=0.5, verbose=False)
        detections = []

        for r in results:
            for box in r.boxes:
                cls = int(box.cls)
                if cls in vehicle_classes:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    conf = float(box.conf)
                    w = x2 - x1
                    h = y2 - y1
                    # DeepSort requires [left, top, w, h]
                    detections.append(([x1, y1, w, h], conf, 'vehicle'))

        # Update tracks using DeepSORT
        tracks = tracker.update_tracks(detections, frame=frame)
        snapshots_to_take = []

        for track in tracks:
            if not track.is_confirmed():
                continue

            track_id = track.track_id
            l, t, r, b = map(int, track.to_ltrb())
            w = r - l
            h = b - t
            cx = l + w // 2
            cy = t + h // 2

            # Initialize history for this specific track
            if track_id not in track_history:
                track_history[track_id] = []

            track_history[track_id].append((cx, cy))

            # Keep only the last 10 positions to calculate movement vector
            if len(track_history[track_id]) > 10:
                track_history[track_id].pop(0)

            color = (0, 255, 0)  # Default green

            # Only check for violations if we have enough historical data
            if len(track_history[track_id]) >= 5:
                y_positions = [p[1] for p in track_history[track_id]]
                dy = y_positions[-1] - y_positions[0]

                # 🚨 Wrong-side detection logic
                if dy > 20:
                    color = (0, 0, 255)
                    cv2.putText(frame, "WRONG SIDE!", (l, t - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                    
                    # Update dashboard stats once per unique vehicle
                    if track_id not in violation_ids:
                        violation_ids.add(track_id)
                        violation_count += 1
                        
                        unique_suffix = f"{int(time.time()*1000)}-{track_id}"
                        # Queue screenshot for end of frame loop
                        snapshots_to_take.append(unique_suffix)
                        
                        timestamp = time.strftime("%H:%M:%S")
                        filename = f"V-{unique_suffix}.jpg"
                        
                        violation_obj = {
                            "id": f"V-{unique_suffix}",
                            "type": "Wrong Side",
                            "vehicle": f"Unknown-{track_id}",
                            "reporter": "User Sentinel",
                            "location": "Sentinel Dashcam",
                            "time": timestamp,
                            "date": time.strftime("%b %d, %Y"),
                            "confidence": 0.95,
                            "proofImage": f"http://localhost:5000/static/violations/{filename}",
                            "status": "Pending",
                            "fine": "1,000 PTS"
                        }
                        
                        recent_violations.insert(0, violation_obj)
                        with open(VIOLATIONS_FILE, 'w') as f:
                            json.dump(recent_violations, f)

            # Draw bounding box and ID
            cv2.rectangle(frame, (l, t), (r, b), color, 2)
            cv2.putText(frame, f"ID {track_id}", (l, t - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        for suffix in snapshots_to_take:
            os.makedirs(os.path.join('static', 'violations'), exist_ok=True)
            snapshot_filename = f"V-{suffix}.jpg"
            filepath = os.path.join('static', 'violations', snapshot_filename)
            cv2.imwrite(filepath, frame)

        # Encode and stream
        ret, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        frame_bytes = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

        # Control playback speed
        process_time = time.time() - start_time
        sleep_time = max(0, frame_delay - process_time)
        time.sleep(sleep_time)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed')
def video_feed():
    source = request.args.get('source', 'videos/sample.mp4')
    return Response(generate_frames(source), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/process_client_frame', methods=['POST'])
def process_client_frame():
    global client_tracker, violation_count, recent_violations, client_track_history, client_violation_ids
    
    # Check if it's JSON (base64) or binary data
    if request.is_json:
        data = request.json.get('image')
        if not data:
            return jsonify({"error": "No image data in JSON"}), 400
        header, encoded = data.split(",", 1)
        nparr = np.frombuffer(base64.b64decode(encoded), np.uint8)
    else:
        # 🟢 Optimization: Handle direct binary blob (much faster)
        if not request.data:
            return jsonify({"error": "No binary image data"}), 400
        nparr = np.frombuffer(request.data, np.uint8)
        
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if frame is None:
        return jsonify({"error": "Failed to decode image"}), 400

    # Resize for performance optimization
    frame = cv2.resize(frame, (640, 480))

    # Run YOLO detection
    results = model(frame, conf=0.5, verbose=False)
    detections = []

    for r in results:
        for box in r.boxes:
            cls = int(box.cls)
            if cls in vehicle_classes:
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                conf = float(box.conf)
                w = x2 - x1
                h = y2 - y1
                detections.append(([x1, y1, w, h], conf, 'vehicle'))

    # Update tracks using DeepSORT
    tracks = client_tracker.update_tracks(detections, frame=frame)
    snapshots_to_take = []

    for track in tracks:
        if not track.is_confirmed():
            continue

        track_id = track.track_id
        l, t, r, b = map(int, track.to_ltrb())
        w = r - l
        h = b - t
        cx = l + w // 2
        cy = t + h // 2

        if track_id not in client_track_history:
            client_track_history[track_id] = []

        client_track_history[track_id].append((cx, cy))
        if len(client_track_history[track_id]) > 10:
            client_track_history[track_id].pop(0)

        color = (0, 255, 0)
        # 🟢 Extreme Accuracy Mode: 8 frames of history for rock-solid tracking
        if len(client_track_history[track_id]) >= 8:
            y_positions = [p[1] for p in client_track_history[track_id]]
            dy = y_positions[-1] - y_positions[0]
            
            # Use 25px threshold for 640x480 resolution to match original precision
            if dy > 25: 
                color = (0, 0, 255)
                cv2.putText(frame, "WRONG SIDE!", (l, t - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                
                if track_id not in client_violation_ids:
                    client_violation_ids.add(track_id)
                    violation_count += 1
                    unique_suffix = f"client-{int(time.time()*1000)}-{track_id}"
                    snapshots_to_take.append(unique_suffix)
                    
                    timestamp = time.strftime("%H:%M:%S")
                    violation_obj = {
                        "id": f"V-{unique_suffix}",
                        "type": "Wrong Side",
                        "vehicle": f"Mobile-{track_id}",
                        "reporter": "Mobile Sentinel",
                        "location": "Mobile Camera",
                        "time": timestamp,
                        "date": time.strftime("%b %d, %Y"),
                        "confidence": 0.95,
                        "proofImage": f"http://localhost:5000/static/violations/V-{unique_suffix}.jpg",
                        "status": "Pending",
                        "fine": "1,000 PTS"
                    }
                    recent_violations.insert(0, violation_obj)
                    with open(VIOLATIONS_FILE, 'w') as f:
                        json.dump(recent_violations, f)

        cv2.rectangle(frame, (l, t), (r, b), color, 2)
        cv2.putText(frame, f"ID {track_id}", (l, t - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    for suffix in snapshots_to_take:
        os.makedirs(os.path.join('static', 'violations'), exist_ok=True)
        cv2.imwrite(os.path.join('static', 'violations', f"V-{suffix}.jpg"), frame)

    # Encode back to base64
    _, buffer = cv2.imencode('.jpg', frame, [int(cv2.IMWRITE_JPEG_QUALITY), 70])
    encoded_image = base64.b64encode(buffer).decode('utf-8')
    
    return jsonify({"image": f"data:image/jpeg;base64,{encoded_image}"})

@app.route('/reset_client_tracker', methods=['POST'])
def reset_client_tracker():
    global client_tracker, client_track_history, client_violation_ids
    client_tracker = DeepSort(max_age=30)
    client_track_history = {}
    client_violation_ids.clear()
    return jsonify({"status": "success"})

@app.route('/cameras')
def list_cameras():
    # Only try first few indices to be fast
    available_cameras = []
    
    # For linux, video devices are typically in /dev/video*
    # However we can just probe cv2
    for i in range(5):
        cap = cv2.VideoCapture(i)
        if cap.isOpened():
            ret, frame = cap.read()
            if ret:
                name = f"Camera {i}"
                if os.path.exists(f"/sys/class/video4linux/video{i}/name"):
                    try:
                        with open(f"/sys/class/video4linux/video{i}/name", 'r') as f:
                            name = f.read().strip()
                    except:
                        pass
                available_cameras.append({"id": i, "name": name})
            cap.release()
            
    return jsonify(available_cameras)

@app.route('/get_stats')
def get_stats():
    global recent_violations, violation_count
    # RE-READ FROM DISK: Ensures manual edits to violations.json show up instantly
    if os.path.exists(VIOLATIONS_FILE):
        try:
            with open(VIOLATIONS_FILE, 'r') as f:
                recent_violations = json.load(f)
                violation_count = len(recent_violations)
        except Exception as e:
            print(f"Error refreshing stats from disk: {e}")
            
    return jsonify({
        "violations": violation_count,
        "recent": recent_violations
    })

@app.route('/pay_fine/<violation_id>', methods=['POST'])
def pay_fine(violation_id):
    global recent_violations
    for v in recent_violations:
        if v['id'] == violation_id:
            v['status'] = 'Paid'
            break
    with open(VIOLATIONS_FILE, 'w') as f:
        json.dump(recent_violations, f)
    return jsonify({"status": "success"})

@app.route('/update_status/<violation_id>', methods=['POST'])
def update_status(violation_id):
    global recent_violations
    data = request.json
    new_status = data.get("status", "Verified")
    for v in recent_violations:
        if v['id'] == violation_id:
            v['status'] = new_status
            break
    with open(VIOLATIONS_FILE, 'w') as f:
        json.dump(recent_violations, f)
    return jsonify({"status": "success"})

@app.route('/submit_report', methods=['POST'])
def submit_report():
    global recent_violations, violation_count
    data = request.json
    new_id = f"R-{int(time.time())}"
    violation_obj = {
        "id": new_id,
        "type": data.get("type", "Unknown"),
        "vehicle": data.get("vehicle", "Unknown"),
        "reporter": data.get("reporter", "User Sentinel"),
        "location": data.get("location", "Manually Reported"),
        "time": time.strftime("%H:%M:%S"),
        "date": time.strftime("%b %d, %Y"),
        "confidence": 1.0,
        "proofImage": data.get("proofImage", "http://localhost:5000/static/violations/demo.png"),
        "status": "Verified",
        "fine": "2,000 PTS"
    }
    recent_violations.insert(0, violation_obj)
    violation_count += 1
    with open(VIOLATIONS_FILE, 'w') as f:
        json.dump(recent_violations, f)
    return jsonify({"status": "success", "id": new_id})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True, threaded=True)