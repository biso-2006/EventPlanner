import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../services/event';

@Component({
  selector: 'app-create-event',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class CreateEvent {
  // Form fields
  title = '';
  description = '';
  date = '';
  time = '';
  location = '';

  // UI states
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const eventData = {
      title: this.title.trim(),
      description: this.description.trim(),
      date: this.date,
      time: this.time,
      location: this.location.trim()
    };

    this.eventService.createEvent(eventData).subscribe({
      next: (event) => {
        this.successMessage = 'Event created successfully!';
        setTimeout(() => {
          this.router.navigate(['/events', event.id]);
        }, 1000);
      },
      error: (error) => {
        this.errorMessage = error.error?.detail || 'Failed to create event. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  validateForm(): boolean {
    if (!this.title.trim()) {
      this.errorMessage = 'Event title is required';
      return false;
    }

    if (this.title.trim().length < 3) {
      this.errorMessage = 'Event title must be at least 3 characters';
      return false;
    }

    if (!this.date) {
      this.errorMessage = 'Event date is required';
      return false;
    }

    if (!this.time) {
      this.errorMessage = 'Event time is required';
      return false;
    }

    if (!this.location.trim()) {
      this.errorMessage = 'Event location is required';
      return false;
    }

    return true;
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}
