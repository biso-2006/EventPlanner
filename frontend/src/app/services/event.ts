import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Auth } from './auth';

export interface Attendee {
  email: string;
  role: string;
  status: string;
}

export interface Event {
  id?: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
  organizer_email?: string;
  attendees?: Attendee[];
  created_at?: string;
  updated_at?: string;
  user_role?: string;
  user_status?: string;
}

export interface EventCreate {
  title: string;
  description?: string;
  date: string;
  time: string;
  location: string;
}

export interface EventInvite {
  emails: string[];
}

export interface EventResponse {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'https://git-backend-ahmad-elhawwary-dev.apps.rm3.7wse.p1.openshiftapps.com/events';

  constructor(private http: HttpClient, private authService: Auth) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all events with filters
  getAllEvents(search?: string, dateFrom?: string, dateTo?: string, role?: string): Observable<Event[]> {
    let params = new HttpParams();

    if (search) params = params.set('search', search);
    if (dateFrom) params = params.set('date_from', dateFrom);
    if (dateTo) params = params.set('date_to', dateTo);
    if (role) params = params.set('role', role);

    return this.http.get<Event[]>(`${this.apiUrl}/`, {
      headers: this.getHeaders(),
      params
    });
  }

  // Get events organized by current user
  getMyEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/my-events`, {
      headers: this.getHeaders()
    });
  }

  // Get events where user is invited
  getInvitations(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/invitations`, {
      headers: this.getHeaders()
    });
  }

  // Get single event
  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Create event
  createEvent(event: EventCreate): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/`, event, {
      headers: this.getHeaders()
    });
  }

  // Update event
  updateEvent(id: string, event: Partial<EventCreate>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, event, {
      headers: this.getHeaders()
    });
  }

  // Delete event
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }

  // Invite users to event
  inviteToEvent(id: string, invite: EventInvite): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/invite`, invite, {
      headers: this.getHeaders()
    });
  }

  // Respond to event
  respondToEvent(id: string, response: EventResponse): Observable<Event> {
    return this.http.post<Event>(`${this.apiUrl}/${id}/respond`, response, {
      headers: this.getHeaders()
    });
  }
}
