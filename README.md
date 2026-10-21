# Office Flask + React App

Full-stack Office Dashboard with:
- **Backend**: Flask REST API
- **Frontend**: React (Vite) + React Router
- **Docker** + **docker-compose**
- **Jenkins** CI/CD pipeline
- **pytest** for backend tests

## Project Structure

```
office-flask-react-app/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── pytest.ini
│   ├── Dockerfile
│   └── tests/
├── frontend/
│   ├── package.json
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
├── Jenkinsfile
└── .gitignore
```

## Features

- Employee management (list, add, delete)
- Task tracking
- Dashboard with stats
- CORS-enabled API
- Dockerized frontend + backend

## Quick Start (Docker)

```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:5000/api/health  

## Local Development

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000 and proxies `/api` to the backend.

## Tests

```bash
cd backend
pytest
```

## Jenkins

The included `Jenkinsfile` runs:
1. Backend unit tests
2. Frontend build
3. Docker image build
4. Deploy (on `main` branch)
