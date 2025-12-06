# Docker Commands - Manual Execution (Without Docker Compose)

This guide shows how to build and run all Docker containers manually, in the correct order.

## Prerequisites
- Docker installed and running
- All Dockerfiles created (backend, frontend, mongo)

---

## Step 1: Create Docker Network
```bash
docker network create eventplanner-network
```

---

## Step 2: Create Volume for MongoDB Data Persistence
```bash
docker volume create eventplanner_mongo-data
```

---

## Step 3: Build Docker Images

### Build MongoDB Image
```bash
docker build -t eventplanner-mongo ./mongo
```

### Build Backend Image
```bash
docker build -t eventplanner-backend ./backend
```

### Build Frontend Image
```bash
docker build -t eventplanner-frontend ./frontend
```

---

## Step 4: Run Containers (IN ORDER)

### 4.1 Run MongoDB Container (First)
```bash
docker run -d --name eventplanner-mongo --restart unless-stopped -p 27017:27017 -v eventplanner_mongo-data:/data/db --network eventplanner-network eventplanner-mongo
```

**Wait a few seconds for MongoDB to start**

### 4.2 Run Backend Container (Second)
```bash
docker run -d --name eventplanner-backend --restart unless-stopped -p 8000:8000 --env-file ./backend/.env -v ${PWD}/backend:/app --network eventplanner-network eventplanner-backend
```

**Windows PowerShell users, use this instead:**
```powershell
docker run -d --name eventplanner-backend --restart unless-stopped -p 8000:8000 --env-file ./backend/.env -v ${PWD}/backend:/app --network eventplanner-network eventplanner-backend
```

**Windows CMD users, use this instead:**
```cmd
docker run -d --name eventplanner-backend --restart unless-stopped -p 8000:8000 --env-file ./backend/.env -v %cd%/backend:/app --network eventplanner-network eventplanner-backend
```

### 4.3 Run Frontend Container (Third)
```bash
docker run -d --name eventplanner-frontend --restart unless-stopped -p 4200:4200 -v ${PWD}/frontend:/app -v /app/node_modules --network eventplanner-network eventplanner-frontend
```

**Windows PowerShell users, use this instead:**
```powershell
docker run -d --name eventplanner-frontend --restart unless-stopped -p 4200:4200 -v ${PWD}/frontend:/app -v /app/node_modules --network eventplanner-network eventplanner-frontend
```

**Windows CMD users, use this instead:**
```cmd
docker run -d --name eventplanner-frontend --restart unless-stopped -p 4200:4200 -v %cd%/frontend:/app -v /app/node_modules --network eventplanner-network eventplanner-frontend
```

---

## Step 5: Verify Containers Are Running
```bash
docker ps
```

You should see 3 containers:
- eventplanner-mongo
- eventplanner-backend
- eventplanner-frontend

---

## Step 6: View Logs (Optional)

### View all logs
```bash
docker logs eventplanner-mongo
docker logs eventplanner-backend
docker logs eventplanner-frontend
```

### Follow logs in real-time
```bash
docker logs -f eventplanner-backend
docker logs -f eventplanner-frontend
```

---

## Access Your Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **MongoDB**: mongodb://localhost:27017

---

## Management Commands

### Stop Containers
```bash
docker stop eventplanner-frontend
docker stop eventplanner-backend
docker stop eventplanner-mongo
```

### Start Containers (if already created)
```bash
docker start eventplanner-mongo
docker start eventplanner-backend
docker start eventplanner-frontend
```

### Restart Containers
```bash
docker restart eventplanner-mongo
docker restart eventplanner-backend
docker restart eventplanner-frontend
```

### Remove Containers (must stop first)
```bash
docker stop eventplanner-frontend eventplanner-backend eventplanner-mongo
docker rm eventplanner-frontend eventplanner-backend eventplanner-mongo
```

### Remove Network
```bash
docker network rm eventplanner-network
```

### Remove Volume (⚠️ This deletes MongoDB data!)
```bash
docker volume rm eventplanner_mongo-data
```

### Remove Images
```bash
docker rmi eventplanner-frontend
docker rmi eventplanner-backend
docker rmi eventplanner-mongo
```

---

## Complete Cleanup (Start Fresh)

```bash
# Stop and remove containers
docker stop eventplanner-frontend eventplanner-backend eventplanner-mongo
docker rm eventplanner-frontend eventplanner-backend eventplanner-mongo

# Remove network
docker network rm eventplanner-network

# Remove volume (deletes data)
docker volume rm eventplanner_mongo-data

# Remove images
docker rmi eventplanner-frontend eventplanner-backend eventplanner-mongo
```

---

## Rebuild After Code Changes

### Rebuild Specific Service
```bash
# Stop and remove container
docker stop eventplanner-backend
docker rm eventplanner-backend

# Rebuild image
docker build -t eventplanner-backend ./backend

# Run new container
docker run -d --name eventplanner-backend --restart unless-stopped -p 8000:8000 --env-file ./backend/.env -v ${PWD}/backend:/app --network eventplanner-network eventplanner-backend
```

### Rebuild All
```bash
# Stop all
docker stop eventplanner-frontend eventplanner-backend eventplanner-mongo
docker rm eventplanner-frontend eventplanner-backend eventplanner-mongo

# Rebuild all images
docker build -t eventplanner-mongo ./mongo
docker build -t eventplanner-backend ./backend
docker build -t eventplanner-frontend ./frontend

# Run all containers (in order)
docker run -d --name eventplanner-mongo --restart unless-stopped -p 27017:27017 -v eventplanner_mongo-data:/data/db --network eventplanner-network eventplanner-mongo

docker run -d --name eventplanner-backend --restart unless-stopped -p 8000:8000 --env-file ./backend/.env -v ${PWD}/backend:/app --network eventplanner-network eventplanner-backend

docker run -d --name eventplanner-frontend --restart unless-stopped -p 4200:4200 -v ${PWD}/frontend:/app -v /app/node_modules --network eventplanner-network eventplanner-frontend
```

---

## Why Docker Compose is Better

All of the above can be replaced with just:

```bash
# Start everything
docker-compose up -d --build

# Stop everything
docker-compose down

# View logs
docker-compose logs -f
```

**Recommendation**: Use `docker-compose.yml` for easier management! 🎉
