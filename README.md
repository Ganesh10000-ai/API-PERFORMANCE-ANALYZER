# ⚡ API Performance Analyzer

A full-stack load testing tool that measures real latency metrics for any HTTP endpoint.

## Tech Stack
- **Frontend:** React + Vite + Recharts
- **Backend:** FastAPI + SQLite + httpx

## Features
- Concurrent vs Sequential execution mode
- Min / Avg / P95 / P99 / Max latency tracking
- SLA threshold alerting with visual breach detection
- HTTP Method support (GET, POST, PUT, PATCH, DELETE)
- Export results to CSV
- Full test history dashboard

## Setup

### Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload


### Frontend
cd frontend
npm install
npm run dev


## Usage
1. Open `http://localhost:5173`
2. Enter any API endpoint URL
3. Set number of requests, HTTP method, and SLA threshold
4. Click **Run Test** and analyze results