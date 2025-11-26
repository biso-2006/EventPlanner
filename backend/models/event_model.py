from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class EventAttendee(BaseModel):
    email: str
    role: str  # "organizer" or "attendee"
    status: str = "pending"  # "going", "maybe", "not_going", "pending"

class Event(BaseModel):
    title: str
    description: Optional[str] = None
    date: str  # ISO format date
    time: str
    location: str
    organizer_email: str
    attendees: List[EventAttendee] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
