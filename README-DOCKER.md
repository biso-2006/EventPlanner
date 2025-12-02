# Docker Setup Guide for EventPlanner

## Prerequisites
- Docker installed on your machine
- Docker Compose installed
- MongoDB Atlas account with connection string

## Setup Instructions

### 1. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your MongoDB Atlas connection string:
```
MONGO_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/eventplanner?retryWrites=true&w=majority
DATABASE_NAME=eventplanner
SECRET_KEY=your_super_secret_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_HOURS=3
```

### 2. Build and Run with Docker Compose

From the root directory (`EventPlanner`):

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

### 4. Docker Commands

```bash
# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild specific service
docker-compose up -d --build backend
docker-compose up -d --build frontend

# Restart services
docker-compose restart

# Stop and remove all containers, networks
docker-compose down
```

### 5. Building Individual Images

If you prefer to build and run containers individually:

#### Backend:
```bash
cd backend
docker build -t eventplanner-backend .
docker run -p 8000:8000 --env-file .env eventplanner-backend
```

#### Frontend:
```bash
cd frontend
docker build -t eventplanner-frontend .
docker run -p 4200:4200 eventplanner-frontend
```

## Data Persistence

- **MongoDB Atlas**: Your data is persisted in MongoDB Atlas cloud database
- **Code Changes**: Volumes are mounted so code changes reflect immediately (hot-reload enabled)
- **node_modules**: Frontend node_modules are persisted in an anonymous volume for faster rebuilds

## Troubleshooting

### Backend won't start:
1. Check if `.env` file exists in `backend` directory
2. Verify MongoDB Atlas connection string is correct
3. Check logs: `docker-compose logs backend`

### Frontend won't start:
1. Check if port 4200 is already in use
2. Check logs: `docker-compose logs frontend`
3. Try rebuilding: `docker-compose up -d --build frontend`

### Cannot connect to backend from frontend:
1. Make sure both containers are running: `docker-compose ps`
2. Verify backend is accessible: http://localhost:8000
3. Check that frontend services use `http://localhost:8000`

## Notes

- The frontend runs in development mode with hot-reload enabled
- The backend runs with `--reload` flag for auto-restart on code changes
- Both containers mount source code as volumes for live development
- No local MongoDB needed - connects directly to MongoDB Atlas
