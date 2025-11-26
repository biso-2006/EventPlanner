from fastapi import APIRouter, HTTPException, Depends, status, Query
from database import db
from utils.jwt_handler import get_current_user
from schemas.event_schema import EventCreate, EventUpdate, EventInvite, EventResponse, EventOut, AttendeeSchema
from datetime import datetime
from bson import ObjectId
from typing import List, Optional

event_router = APIRouter(prefix="/events", tags=["Events"])

def event_helper(event, current_user_email: str) -> dict:
    """Convert MongoDB event document to response format"""
    # Find current user's role and status
    user_role = None
    user_status = None
    
    if event["organizer_email"] == current_user_email:
        user_role = "organizer"
        user_status = "going"  # Organizer is always going
    else:
        for attendee in event.get("attendees", []):
            if attendee["email"] == current_user_email:
                user_role = attendee["role"]
                user_status = attendee["status"]
                break
    
    return {
        "id": str(event["_id"]),
        "title": event["title"],
        "description": event.get("description"),
        "date": event["date"],
        "time": event["time"],
        "location": event["location"],
        "organizer_email": event["organizer_email"],
        "attendees": event.get("attendees", []),
        "created_at": event["created_at"],
        "updated_at": event["updated_at"],
        "user_role": user_role,
        "user_status": user_status
    }

@event_router.post("/", response_model=EventOut, status_code=status.HTTP_201_CREATED)
async def create_event(event: EventCreate, current_user: str = Depends(get_current_user)):
    """Create a new event"""
    try:
        event_dict = {
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "time": event.time,
            "location": event.location,
            "organizer_email": current_user,
            "attendees": [{
                "email": current_user,
                "role": "organizer",
                "status": "going"
            }],
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await db.events.insert_one(event_dict)
        created_event = await db.events.find_one({"_id": result.inserted_id})
        
        return event_helper(created_event, current_user)
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

@event_router.get("/", response_model=List[EventOut])
async def get_all_events(
    current_user: str = Depends(get_current_user),
    search: Optional[str] = Query(None, description="Search by title or description"),
    date_from: Optional[str] = Query(None, description="Filter by start date (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(None, description="Filter by end date (YYYY-MM-DD)"),
    role: Optional[str] = Query(None, description="Filter by role: organizer or attendee")
):
    """Get all events with optional filters"""
    try:
        query = {}
        
        # Search filter
        if search:
            query["$or"] = [
                {"title": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]
        
        # Date filters
        if date_from or date_to:
            query["date"] = {}
            if date_from:
                query["date"]["$gte"] = date_from
            if date_to:
                query["date"]["$lte"] = date_to
        
        events = await db.events.find(query).to_list(length=None)
        
        result = []
        for event in events:
            event_data = event_helper(event, current_user)
            
            # Apply role filter
            if role:
                if role == "organizer" and event_data["user_role"] == "organizer":
                    result.append(event_data)
                elif role == "attendee" and event_data["user_role"] == "attendee":
                    result.append(event_data)
            else:
                result.append(event_data)
        
        # Sort by date (newest first)
        result.sort(key=lambda x: (x["date"], x["time"]), reverse=True)
        
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch events: {str(e)}"
        )

@event_router.get("/my-events", response_model=List[EventOut])
async def get_my_events(current_user: str = Depends(get_current_user)):
    """Get events organized by current user"""
    try:
        events = await db.events.find({"organizer_email": current_user}).to_list(length=None)
        return [event_helper(event, current_user) for event in events]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch events: {str(e)}"
        )

@event_router.get("/invitations", response_model=List[EventOut])
async def get_invitations(current_user: str = Depends(get_current_user)):
    """Get events where current user is invited (not organizer)"""
    try:
        events = await db.events.find({
            "attendees.email": current_user,
            "organizer_email": {"$ne": current_user}
        }).to_list(length=None)
        
        return [event_helper(event, current_user) for event in events]
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch invitations: {str(e)}"
        )

@event_router.get("/{event_id}", response_model=EventOut)
async def get_event(event_id: str, current_user: str = Depends(get_current_user)):
    """Get a specific event by ID"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID")
        
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return event_helper(event, current_user)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch event: {str(e)}"
        )

@event_router.put("/{event_id}", response_model=EventOut)
async def update_event(
    event_id: str,
    event_update: EventUpdate,
    current_user: str = Depends(get_current_user)
):
    """Update an event (organizer only)"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID")
        
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        if event["organizer_email"] != current_user:
            raise HTTPException(status_code=403, detail="Only organizer can update event")
        
        update_data = {k: v for k, v in event_update.dict().items() if v is not None}
        
        if update_data:
            update_data["updated_at"] = datetime.utcnow()
            await db.events.update_one(
                {"_id": ObjectId(event_id)},
                {"$set": update_data}
            )
        
        updated_event = await db.events.find_one({"_id": ObjectId(event_id)})
        return event_helper(updated_event, current_user)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update event: {str(e)}"
        )

@event_router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(event_id: str, current_user: str = Depends(get_current_user)):
    """Delete an event (organizer only)"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID")
        
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        if event["organizer_email"] != current_user:
            raise HTTPException(status_code=403, detail="Only organizer can delete event")
        
        await db.events.delete_one({"_id": ObjectId(event_id)})
        
        return None
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete event: {str(e)}"
        )

@event_router.post("/{event_id}/invite", response_model=EventOut)
async def invite_to_event(
    event_id: str,
    invite_data: EventInvite,
    current_user: str = Depends(get_current_user)
):
    """Invite users to an event (organizer only)"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID")
        
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        if event["organizer_email"] != current_user:
            raise HTTPException(status_code=403, detail="Only organizer can invite users")
        
        # Get existing attendee emails
        existing_emails = {att["email"] for att in event.get("attendees", [])}
        
        # Add new attendees
        new_attendees = []
        for email in invite_data.emails:
            if email not in existing_emails and email != current_user:
                new_attendees.append({
                    "email": email,
                    "role": "attendee",
                    "status": "pending"
                })
        
        if new_attendees:
            await db.events.update_one(
                {"_id": ObjectId(event_id)},
                {
                    "$push": {"attendees": {"$each": new_attendees}},
                    "$set": {"updated_at": datetime.utcnow()}
                }
            )
        
        updated_event = await db.events.find_one({"_id": ObjectId(event_id)})
        return event_helper(updated_event, current_user)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to invite users: {str(e)}"
        )

@event_router.post("/{event_id}/respond", response_model=EventOut)
async def respond_to_event(
    event_id: str,
    response: EventResponse,
    current_user: str = Depends(get_current_user)
):
    """Respond to an event invitation"""
    try:
        if not ObjectId.is_valid(event_id):
            raise HTTPException(status_code=400, detail="Invalid event ID")
        
        event = await db.events.find_one({"_id": ObjectId(event_id)})
        
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        
        # Check if user is in attendees list
        attendee_found = False
        for attendee in event.get("attendees", []):
            if attendee["email"] == current_user:
                attendee_found = True
                break
        
        if not attendee_found:
            raise HTTPException(status_code=403, detail="You are not invited to this event")
        
        # Don't allow organizer to change status (always "going")
        if event["organizer_email"] == current_user:
            raise HTTPException(status_code=400, detail="Organizer status cannot be changed")
        
        # Update attendee status
        await db.events.update_one(
            {"_id": ObjectId(event_id), "attendees.email": current_user},
            {
                "$set": {
                    "attendees.$.status": response.status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        updated_event = await db.events.find_one({"_id": ObjectId(event_id)})
        return event_helper(updated_event, current_user)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to respond to event: {str(e)}"
        )
