import { Component, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { EventService, Event } from '../../services/event';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  userEmail = computed(() => this.authService.userEmail());

  // Signals
  activeTab = signal<'all' | 'invitations'>('all');
  events = signal<Event[]>([]);
  filteredEvents = signal<Event[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  // Filters (regular properties for ngModel)
  searchQuery = '';
  dateFrom = '';
  dateTo = '';
  roleFilter = '';

  constructor(
    private authService: Auth,
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const service$ = this.activeTab() === 'all'
      ? this.eventService.getAllEvents(
        this.searchQuery || undefined,
        this.dateFrom || undefined,
        this.dateTo || undefined,
        this.roleFilter || undefined
      )
      : this.eventService.getInvitations();

    service$.subscribe({
      next: (events) => {
        this.events.set(events);
        this.filteredEvents.set(events);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load events');
        this.isLoading.set(false);
      }
    });
  }

  switchTab(tab: 'all' | 'invitations') {
    this.activeTab.set(tab);
    this.clearFilters();
    this.loadEvents();
  }

  applyFilters() {
    this.loadEvents();
  }

  clearFilters() {
    this.searchQuery = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.roleFilter = '';
  }

  createEvent() {
    this.router.navigate(['/create-event']);
  }

  viewEvent(eventId: string) {
    this.router.navigate(['/events', eventId]);
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'going': return 'badge-going';
      case 'maybe': return 'badge-maybe';
      case 'not_going': return 'badge-not-going';
      case 'pending': return 'badge-pending';
      default: return 'badge-default';
    }
  }

  getRoleBadgeClass(role?: string): string {
    return role === 'organizer' ? 'badge-organizer' : 'badge-attendee';
  }

  logout(): void {
    this.authService.logout();
  }
}
