import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  userEmail = computed(() => this.authService.userEmail());

  constructor(private authService: Auth, private router: Router) { }

  logout(): void {
    this.authService.logout();
  }
}
