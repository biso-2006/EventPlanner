import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService, Event } from '../../services/event';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails implements OnInit {
  event = signal<Event | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  // Invite form
  inviteEmail = '';
  isInviting = signal(false);
  inviteError = signal('');
  inviteSuccess = signal('');

  // Response states
  isResponding = signal(false);

  eventId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: Auth
  ) { }

  // Current user email (initialized after constructor)
  currentUserEmail() {
    return this.authService.userEmail();
  }

  ngOnInit() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    if (this.eventId) {
      this.loadEvent();
    }
  }

  loadEvent() {
    if (!this.eventId) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.eventService.getEvent(this.eventId).subscribe({
      next: (event) => {
        this.event.set(event);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.detail || 'Failed to load event');
        this.isLoading.set(false);
      }
    });
  }

  isOrganizer(): boolean {
    return this.event()?.user_role === 'organizer';
  }

  canInvite(): boolean {
    return this.isOrganizer();
  }

  inviteUser() {
    if (!this.eventId || !this.inviteEmail.trim()) {
      this.inviteError.set('Please enter an email address');
      return;
    }

    this.isInviting.set(true);
    this.inviteError.set('');
    this.inviteSuccess.set('');

    this.eventService.inviteToEvent(this.eventId, { emails: [this.inviteEmail.trim()] }).subscribe({
      next: () => {
        this.inviteSuccess.set(`Invitation sent to ${this.inviteEmail}`);
        this.inviteEmail = '';
        this.isInviting.set(false);
        this.loadEvent(); // Reload to show updated attendees
      },
      error: (error) => {
        this.inviteError.set(error.error?.detail || 'Failed to send invitation');
        this.isInviting.set(false);
      }
    });
  }

  respondToEvent(status: 'going' | 'maybe' | 'not_going') {
    if (!this.eventId) return;

    this.isResponding.set(true);

    this.eventService.respondToEvent(this.eventId, { status }).subscribe({
      next: () => {
        this.isResponding.set(false);
        this.loadEvent(); // Reload to show updated status
      },
      error: (error) => {
        alert(error.error?.detail || 'Failed to update response');
        this.isResponding.set(false);
      }
    });
  }

  deleteEvent() {
    if (!this.eventId || !confirm('Are you sure you want to delete this event?')) return;

    this.eventService.deleteEvent(this.eventId).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: (error) => {
        alert(error.error?.detail || 'Failed to delete event');
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  getStatusBadgeClass(status: string): string {
    return `status-${status.replace('_', '-')}`;
  }

  getStatusLabel(status: string): string {
    return status === 'not_going' ? 'Not Going' :
      status === 'maybe' ? 'Maybe' :
        status.charAt(0).toUpperCase() + status.slice(1);
  }
}
