import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './components/home/home';
import { inject } from '@angular/core';
import { Auth } from './services/auth';
import { Router } from '@angular/router';

// Auth Guard
export const authGuard = () => {
    const authService = inject(Auth);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    router.navigate(['/auth/login']);
    return false;
};

export const routes: Routes = [
    { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
    { path: 'auth/login', component: Login },
    { path: 'auth/signup', component: Signup },
    { path: 'home', component: Home, canActivate: [authGuard] }
];
