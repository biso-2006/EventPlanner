# EventPlanner Backend Setup

## Prerequisites
- Python 3.8+
- MongoDB Atlas account (already configured)

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables
The `.env` file is already configured with your MongoDB Atlas connection.

### 3. Run the Application
```bash
uvicorn main:app --reload
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Public Endpoints
- `GET /` - Health check
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get token

### Protected Endpoints
- `GET /auth/me` - Get current user info (requires authentication)

## Testing the API

### 1. Register a User
```bash
POST http://localhost:8000/auth/signup
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST http://localhost:8000/auth/login
Content-Type: application/x-www-form-urlencoded

username=test@example.com&password=password123
```

### 3. Get Current User (Protected)
```bash
GET http://localhost:8000/auth/me
Authorization: Bearer <your_token_here>
```

## API Documentation
Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Security Notes
- Change `SECRET_KEY` in `.env` for production
- Never commit `.env` to version control
- Use HTTPS in production
