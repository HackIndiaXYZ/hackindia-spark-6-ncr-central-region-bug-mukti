import cv2
from ultralytics import YOLO
from deep_sort_realtime.deepsort_tracker import DeepSort

# Load YOLO model
model = YOLO("yolov8n.pt")

# Initialize tracker
tracker = DeepSort(max_age=30)

cap = cv2.VideoCapture("videos/sample.mp4")

vehicle_classes = [2, 3, 5, 7]

# Store position history
track_history = {}

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, conf=0.5)

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

    tracks = tracker.update_tracks(detections, frame=frame)

    for track in tracks:
        if not track.is_confirmed():
            continue

        track_id = track.track_id

        l, t, r, b = map(int, track.to_ltrb())

        w = r - l
        h = b - t

        cx = l + w // 2
        cy = t + h // 2

        # Initialize history
        if track_id not in track_history:
            track_history[track_id] = []

        track_history[track_id].append((cx, cy))

        # Keep only last 10 positions
        if len(track_history[track_id]) > 10:
            track_history[track_id].pop(0)

        color = (0, 255, 0)  # green default

        # Only check if enough history
        if len(track_history[track_id]) >= 5:
            y_positions = [p[1] for p in track_history[track_id]]

            dy = y_positions[-1] - y_positions[0]

            # 🚨 Wrong-side detection
            if dy > 20:
                color = (0, 0, 255)

                cv2.putText(frame, "WRONG SIDE!",
                            (l, t - 30),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            0.7,
                            (0, 0, 255),
                            2)

        cv2.rectangle(frame, (l, t), (r, b), color, 2)

        cv2.putText(frame, f"ID {track_id}",
                    (l, t - 10),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    color,
                    2)

    cv2.imshow("Road Safety System", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()