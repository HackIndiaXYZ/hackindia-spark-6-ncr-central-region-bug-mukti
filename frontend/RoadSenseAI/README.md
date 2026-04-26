# 🚦 RoadGuard AI – Road Safety Monitoring Dashboard

![AI](https://img.shields.io/badge/AI-Computer%20Vision-blue)
![Dashboard](https://img.shields.io/badge/Dashboard-Web%20Interface-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

An **AI-powered road safety monitoring system** that detects road hazards using dashcam footage and visualizes them through a real-time monitoring dashboard.

---

# 📌 Overview

**RoadGuard AI** transforms everyday vehicles into **intelligent road safety sensors**.  

Using **computer vision and deep learning**, the system analyzes dashcam footage to detect dangerous road situations and displays them on a **centralized dashboard** for authorities and emergency responders.

This repository contains the **dashboard interface** used to monitor incidents detected by the AI pipeline.

---

# 🚨 Problem Statement

Road accidents remain one of the biggest public safety challenges.

Traditional monitoring methods rely on:
- Traffic police
- Fixed CCTV cameras

These systems **cannot monitor every road continuously**.

At the same time, millions of vehicles already have **dashcams**, but this data is rarely used for road safety.

---

# 💡 Solution

RoadGuard AI creates a **crowdsourced road monitoring network** by analyzing dashcam footage using AI.

The system detects events such as:

- 🚗 Wrong-side driving
- 🕳️ Potholes and road damage
- 💥 Road accidents
- 🔥 Vehicle fires or smoke

Detected incidents are converted into **geo-tagged alerts** and displayed on a **real-time dashboard**.

---

# 🏗 System Architecture

```text
Dashcam Video
      ↓
AI Detection (YOLOv8 + ByteTrack)
      ↓
Backend API
      ↓
PostgreSQL + PostGIS
      ↓
RoadGuard AI Dashboard
```

---

# ✨ Features

✔ Real-time incident visualization  
✔ Geo-tagged alerts on map  
✔ Incident classification system  
✔ Timestamp and location tracking  
✔ Simple and responsive dashboard UI  
✔ Smart city monitoring support  

---

# 🛠 Technologies Used

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- REST APIs

### Database
- PostgreSQL
- PostGIS (geospatial extension)

### Mapping
- Leaflet.js
- OpenStreetMap

### AI Pipeline (External Module)
- Python
- OpenCV
- YOLOv8
- ByteTrack

---

# 📊 Dashboard Capabilities

The dashboard enables authorities to:

- 📍 View hazard locations on a map  
- 🚨 Monitor real-time road incidents  
- 📑 Track incident history  
- ⚡ Improve emergency response time  

---

# 🖥 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/roadguard-ai-dashboard.git
```

Navigate to the project directory:

```bash
cd roadguard-ai-dashboard
```

Run the project using a local server:

```bash
live-server
```

Or simply open:

```
index.html
```

in your browser.

---

# 🚀 Future Improvements

- Real-time AI streaming integration  
- Mobile dashboard for authorities  
- Emergency notification system  
- Cloud deployment  
- Advanced analytics for road safety  

---

# 📚 Resources & References

### Research & Technologies

- **YOLOv8** – Real-time object detection
- **ByteTrack** – Multi-object tracking algorithm
- **OpenCV** – Computer vision library

### Datasets

- BDD100K Autonomous Driving Dataset  
- Kaggle Road Damage Detection Dataset  
- Indian Road Accident Statistics – Ministry of Road Transport and Highways  

---

# 📂 Project Structure

```
roadguard-ai-dashboard
│
├── index.html
├── style.css
├── script.js
│
├── assets
│   ├── images
│   └── icons
│
└── README.md
```

---

# 👨‍💻 Authors

Developed as part of a **Hackathon Project focused on AI-driven Road Safety Monitoring**.

---

# 📜 License

This project is licensed under the **MIT License**.

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub!
