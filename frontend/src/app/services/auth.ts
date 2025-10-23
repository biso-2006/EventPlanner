import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface SignupResponse {
  message: string;
  id: string;
}

interface UserResponse {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:8000/auth';
  private tokenKey = 'auth_token';
  private userEmailKey = 'user_email';
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;

  // Signal to track authentication state
  isAuthenticated = signal<boolean>(this.hasToken());
  userEmail = signal<string | null>(this.getStoredEmail());

  constructor(private http: HttpClient, private router: Router) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  signup(email: string, password: string): Observable<SignupResponse> {
    return this.http.post<SignupResponse>(`${this.apiUrl}/signup`, {
      email,
      password
    });
  }

  login(email: string, password: string): Observable<LoginResponse> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, formData)
      .pipe(
        tap(response => {
          this.setToken(response.access_token);
          this.setUserEmail(email);
          this.isAuthenticated.set(true);
          this.userEmail.set(email);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userEmailKey);
    }
    this.isAuthenticated.set(false);
    this.userEmail.set(null);
    this.router.navigate(['/auth/login']);
  }

  private setToken(token: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private setUserEmail(email: string): void {
    if (this.isBrowser) {
      localStorage.setItem(this.userEmailKey, email);
    }
  }

  getToken(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private getStoredEmail(): string | null {
    if (this.isBrowser) {
      return localStorage.getItem(this.userEmailKey);
    }
    return null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }
}
