from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import auth_router
from routes.event_routes import event_router

app = FastAPI(title="EventPlanner API")

# Allow Angular frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(event_router)

@app.get("/")
def root():
    return {"message": "EventPlanner API is running 🚀"}
