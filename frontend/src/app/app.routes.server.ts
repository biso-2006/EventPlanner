import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Static routes to prerender
  { path: '', renderMode: RenderMode.Prerender },        // login page
  { path: 'auth/login', renderMode: RenderMode.Prerender },
  { path: 'auth/signup', renderMode: RenderMode.Prerender },
  { path: 'home', renderMode: RenderMode.Prerender },
  { path: 'create-event', renderMode: RenderMode.Prerender },

  // Dynamic route(s) – client-side only
  { path: 'events/:id', renderMode: RenderMode.Client }
];
