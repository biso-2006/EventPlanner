# Event Planner - Full Stack Application

A full-stack event planning application with authentication built using Angular (Frontend) and FastAPI (Backend).

## 🚀 Features

- ✅ User Authentication (Signup/Login)
- ✅ JWT Token-based Authorization
- ✅ Protected Routes with Auth Guards
- ✅ MongoDB Database Integration
- ✅ Responsive UI Design
- ✅ Modern Angular Signals & Standalone Components

## 📁 Project Structure

```
EventPlanner/
├── backend/                 # FastAPI Backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── schemas/            # Pydantic schemas
│   ├── utils/              # Utility functions
│   ├── database.py         # MongoDB connection
│   ├── main.py             # FastAPI app
│   ├── .env                # Environment variables
│   └── requirements.txt    # Python dependencies
│
└── frontend/               # Angular Frontend
    ├── src/app/
    │   ├── components/     # UI Components
    │   │   ├── login/
    │   │   ├── signup/
    │   │   └── home/
    │   ├── services/       # Angular services
    │   │   └── auth.ts     # Authentication service
    │   └── app.routes.ts   # Route configuration
    └── package.json
```

## 🛠️ Installation & Setup

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment variables (`.env` file is already set up):
```env
MONGO_URI=your_mongodb_connection_string
DATABASE_NAME=eventplanner
SECRET_KEY=your_secret_key
```

4. Start the backend server:
```bash
uvicorn main:app --reload
```

Backend will run at: **http://localhost:8000**

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start the Angular development server:
```bash
ng serve
```

Frontend will run at: **http://localhost:4200**

## 🔐 API Endpoints

### Authentication

- **POST** `/auth/signup` - Register a new user
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

- **POST** `/auth/login` - Login (form-data)
  ```
  username: user@example.com
  password: password123
  ```

- **GET** `/auth/me` - Get current user (requires auth token)
  ```
  Authorization: Bearer <token>
  ```

## 🎨 Frontend Pages

1. **Login Page** (`/login`) - User authentication
2. **Signup Page** (`/signup`) - New user registration
3. **Home Page** (`/home`) - Protected page showing welcome message with user email

## 🔒 Authentication Flow

1. User signs up with email and password
2. User logs in and receives JWT token
3. Token is stored in localStorage
4. Protected routes check for valid token
5. User can access home page showing "Hi {email}"

## 🧪 Testing

### Using Postman

**Signup:**
- Method: POST
- URL: `http://localhost:8000/auth/signup`
- Body (JSON):
```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

**Login:**
- Method: POST
- URL: `http://localhost:8000/auth/login`
- Body (x-www-form-urlencoded):
```
username: test@example.com
password: test123
```

### Using the UI

1. Open browser: `http://localhost:4200`
2. Click "Sign up" and create an account
3. Login with your credentials
4. You'll be redirected to home page with greeting

## 🔧 Technologies Used

### Backend
- FastAPI - Modern Python web framework
- MongoDB (Motor) - Async MongoDB driver
- PyMongo - MongoDB client
- Bcrypt - Password hashing
- Python-JOSE - JWT token handling
- Pydantic - Data validation

### Frontend
- Angular 19 - Frontend framework
- TypeScript - Type-safe JavaScript
- Angular Signals - Reactive state management
- Standalone Components - Modern Angular architecture
- RxJS - Reactive programming
- CSS3 - Modern styling

## 📝 Notes

- Make sure MongoDB is running or use MongoDB Atlas (already configured)
- Backend runs on port 8000
- Frontend runs on port 4200
- CORS is enabled for all origins (configure for production)
- Change `SECRET_KEY` in production!

## 🚀 Production Deployment

### Backend
1. Update `.env` with production values
2. Change CORS origins in `main.py`
3. Use production WSGI server (Gunicorn/Uvicorn)

### Frontend
1. Build: `ng build --configuration=production`
2. Deploy `dist/` folder to hosting service
3. Update API URL in auth service

## 📄 License

MIT License

---

**Happy Coding! 🎉**
