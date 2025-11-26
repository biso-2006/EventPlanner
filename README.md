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

3. Configure environment variables (`.env`):
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

#### POST `/auth/signup`
Register a new user

**Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "email": "user@example.com"
}
```

**Errors:**
- `400 Bad Request` - Invalid email format or password too short
- `400 Bad Request` - Email already registered

---

#### POST `/auth/login`
Login and receive JWT token

**Request Body (Form Data):**
```
username: user@example.com
password: password123
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- `401 Unauthorized` - Invalid credentials

---

#### GET `/auth/me`
Get current user information (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "email": "user@example.com"
}
```

**Errors:**
- `401 Unauthorized` - Invalid or missing token

---

### Events

#### POST `/events/`
Create a new event (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (JSON):**
```json
{
  "title": "Team Building Workshop",
  "description": "Fun outdoor activities",
  "date": "2025-12-25",
  "time": "14:00",
  "location": "Central Park"
}
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Team Building Workshop",
  "description": "Fun outdoor activities",
  "date": "2025-12-25",
  "time": "14:00",
  "location": "Central Park",
  "organizer_email": "user@example.com",
  "attendees": [
    {
      "email": "user@example.com",
      "role": "organizer",
      "status": "going"
    }
  ],
  "user_role": "organizer",
  "user_status": "going"
}
```

**Errors:**
- `400 Bad Request` - Invalid data (title too short, invalid date format, etc.)
- `401 Unauthorized` - Missing or invalid token

---

#### GET `/events/`
Get all events with optional search and filters (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `search` (optional) - Search in title and description
- `date_from` (optional) - Filter events from this date (YYYY-MM-DD)
- `date_to` (optional) - Filter events until this date (YYYY-MM-DD)
- `role` (optional) - Filter by user role ("organizer" or "attendee")

**Example:**
```
GET /events/?search=workshop&date_from=2025-12-01&date_to=2025-12-31
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Team Building Workshop",
    "description": "Fun outdoor activities",
    "date": "2025-12-25",
    "time": "14:00",
    "location": "Central Park",
    "organizer_email": "user@example.com",
    "attendees": [...],
    "user_role": "organizer",
    "user_status": "going"
  }
]
```

**Errors:**
- `401 Unauthorized` - Missing or invalid token

---

#### GET `/events/my-events`
Get events organized by current user (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Team Building Workshop",
    "organizer_email": "user@example.com",
    "user_role": "organizer",
    ...
  }
]
```

---

#### GET `/events/invitations`
Get events where user is invited as attendee (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Company Lunch",
    "organizer_email": "boss@example.com",
    "user_role": "attendee",
    "user_status": "pending",
    ...
  }
]
```

---

#### GET `/events/{event_id}`
Get a single event by ID (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Team Building Workshop",
  "description": "Fun outdoor activities",
  "date": "2025-12-25",
  "time": "14:00",
  "location": "Central Park",
  "organizer_email": "user@example.com",
  "attendees": [
    {
      "email": "user@example.com",
      "role": "organizer",
      "status": "going"
    },
    {
      "email": "colleague@example.com",
      "role": "attendee",
      "status": "pending"
    }
  ],
  "user_role": "organizer",
  "user_status": "going"
}
```

**Errors:**
- `404 Not Found` - Event not found or user not authorized
- `401 Unauthorized` - Missing or invalid token

---

#### PUT `/events/{event_id}`
Update an event (requires authentication, organizer only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (JSON):**
```json
{
  "title": "Updated Workshop Title",
  "description": "Updated description",
  "date": "2025-12-26",
  "time": "15:00",
  "location": "Updated Location"
}
```

**Response (200 OK):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Updated Workshop Title",
  ...
}
```

**Errors:**
- `403 Forbidden` - User is not the organizer
- `404 Not Found` - Event not found
- `401 Unauthorized` - Missing or invalid token

---

#### DELETE `/events/{event_id}`
Delete an event (requires authentication, organizer only)

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "message": "Event deleted successfully"
}
```

**Errors:**
- `403 Forbidden` - User is not the organizer
- `404 Not Found` - Event not found
- `401 Unauthorized` - Missing or invalid token

---

#### POST `/events/{event_id}/invite`
Invite users to an event (requires authentication, organizer only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (JSON):**
```json
{
  "emails": ["colleague1@example.com", "colleague2@example.com"]
}
```

**Response (200 OK):**
```json
{
  "message": "Invitations sent successfully",
  "invited_count": 2
}
```

**Errors:**
- `403 Forbidden` - User is not the organizer
- `404 Not Found` - Event not found
- `400 Bad Request` - Invalid email or user already invited
- `401 Unauthorized` - Missing or invalid token

---

#### POST `/events/{event_id}/respond`
Respond to an event invitation (requires authentication, attendee only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body (JSON):**
```json
{
  "status": "going"
}
```

**Valid status values:** `"going"`, `"maybe"`, `"not_going"`

**Response (200 OK):**
```json
{
  "message": "Response updated successfully"
}
```

**Errors:**
- `400 Bad Request` - Invalid status value or user is the organizer
- `404 Not Found` - Event not found or user not invited
- `401 Unauthorized` - Missing or invalid token

---

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

Import the `postman_collection.json` file to test all API endpoints.

**Quick Start:**
1. Import the collection into Postman
2. Signup a new user
3. Login to get the access token
4. The token will be automatically set for subsequent requests
5. Test all event endpoints

**Manual Testing:**

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

**Copy the `access_token` from login response and use it in Authorization header:**
```
Authorization: Bearer <your_access_token>
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
