# SecondSpark AI 🔋♻️

## AI-Powered Circular Automotive Ecosystem

SecondSpark AI is an intelligent sustainability platform focused on extending EV battery lifecycle using:

- AI-driven Battery Health Prediction  
- Remaining Useful Life (RUL) estimation  
- Second-life usage recommendations  
- Digital Material Passport (upcoming)

Built for **ET AutoTech Hackathon 2026**  
Theme: *AI for Circular Economy & Sustainability*

---

# 🚀 Project Vision

EV batteries often get discarded while still usable.

SecondSpark AI solves this by:
- Predicting Battery State of Health (SOH)
- Estimating Remaining Useful Life (RUL)
- Recommending second-life applications
- Reducing environmental waste through AI

---

# 🧠 Core Features

## SOH Prediction
Predicts battery health using telemetry data.

## RUL Prediction
Estimates remaining useful cycles of a battery.

## AI Recommendation Engine
- Continue EV usage
- Stationary energy storage
- Recycling

---

# ⚙️ Tech Stack

## AI / Backend
- Python
- FastAPI
- Scikit-Learn
- Pandas
- Joblib
- Uvicorn

## Frontend
- Next.js
- TypeScript
- Tailwind CSS

## Backend (Future)
- Node.js
- Express.js
- MongoDB

---

# 📂 Project Structure

SecondSpark-AI/
│
├── ai-service/
│   ├── data/
│   ├── models/
│   │   ├── soh_model.pkl
│   │   └── rul_model.pkl
│   ├── main.py
│   ├── train_soh.py
│   ├── train_rul.py
│   └── test_soh.py
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── styles/
│   └── package.json
│
└── README.md

---

# 🔌 API

POST /api/v1/battery/grade

Request:
{
  "cycle": 1200,
  "voltage": 3.6,
  "temperature": 34,
  "capacity": 0.78
}

Response:
{
  "soh": 68.86,
  "rul": 31.4,
  "recommendation": "Stationary Storage"
}

---

# 🖥️ Setup

## Clone Repo
git clone https://github.com/thenameisanjalii/SecondSpark-AI.git
cd SecondSpark-AI

## Backend Setup
cd ai-service
python -m venv venv

venv\Scripts\activate   (Windows)
source venv/bin/activate (Mac/Linux)

pip install fastapi uvicorn pandas scikit-learn joblib pydantic

uvicorn main:app --reload

## Frontend Setup
cd ../frontend
npm install
npm run dev

---

# 🌐 Environment

NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000

---

# 🧪 Run Flow

1. Start backend
2. Start frontend
3. Open localhost:3000
4. Enter data
5. Get prediction

---


# 🏆 Hackathon

ET AutoTech Hackathon 2026
AI for Circular Economy & Sustainability

---

# 📜 License

For educational and hackathon use only.
