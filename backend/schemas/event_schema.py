from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class AttendeeSchema(BaseModel):
    email: str
    role: str
    status: str = "pending"

class EventCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    date: str  # ISO format: YYYY-MM-DD
    time: str  # Format: HH:MM
    location: str = Field(..., min_length=1)

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    location: Optional[str] = None

class EventInvite(BaseModel):
    emails: List[str] = Field(..., min_items=1)

class EventResponse(BaseModel):
    status: str = Field(..., pattern="^(going|maybe|not_going)$")

class EventOut(BaseModel):
    id: str
    title: str
    description: Optional[str]
    date: str
    time: str
    location: str
    organizer_email: str
    attendees: List[AttendeeSchema]
    created_at: datetime
    updated_at: datetime
    user_role: Optional[str] = None  # Role of current user
    user_status: Optional[str] = None  # Status of current user

    class Config:
        from_attributes = True
