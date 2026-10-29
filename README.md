# JobTrack — Job Application Tracker

A simple React + Spring Boot + MongoDB application for tracking job applications.

## Features
- Add company, job role, date, and status
- List saved applications
- Change status (Applied, Interview, Selected, Rejected)
- Filter by status
- Show total application count
- Persist data in MongoDB

## Requirements
- Java 17+
- Maven (or use an IDE with Maven support)
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## Run locally

### 1. Start MongoDB
Start your local MongoDB service, or create a MongoDB Atlas database.

### 2. Run backend
In a terminal:
```bash
cd backend
mvn spring-boot:run
```
Backend API: `http://localhost:8080/api/applications`

For MongoDB Atlas, set `MONGODB_URI` before running. Example (PowerShell):
```powershell
$env:MONGODB_URI="mongodb+srv://USER:PASSWORD@YOUR-CLUSTER.mongodb.net/jobtracker?retryWrites=true&w=majority"
mvn spring-boot:run
```

### 3. Run frontend
Open another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal (usually `http://localhost:5173`).

## API endpoints
- `GET /api/applications` — list all
- `POST /api/applications` — create
- `PATCH /api/applications/{id}/status` — update status
- `DELETE /api/applications/{id}` — delete

Example POST body:
```json
{
  "companyName": "Google",
  "jobRole": "Software Engineer",
  "applicationDate": "2026-10-29",
  "status": "Applied"
}
```

## Deployment outline
1. Create a MongoDB Atlas database and copy its connection string.
2. Deploy `backend` to a Java-capable host (for example, Render) with `MONGODB_URI` set to the Atlas URI and `MONGODB_DATABASE=jobtracker`.
3. Deploy `frontend` to Vercel. Set `VITE_API_URL` to the deployed backend URL plus `/api/applications`, for example `https://YOUR-BACKEND.onrender.com/api/applications`.
4. Update backend CORS allowed origins to include your deployed frontend domain before deploying. The current controller allows localhost for exam/local development.
