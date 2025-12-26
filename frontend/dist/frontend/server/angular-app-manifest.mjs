
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/auth/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/auth/login"
  },
  {
    "renderMode": 2,
    "route": "/auth/signup"
  },
  {
    "renderMode": 2,
    "route": "/home"
  },
  {
    "renderMode": 2,
    "route": "/create-event"
  },
  {
    "renderMode": 1,
    "route": "/events/*"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 809, hash: '82b12ce94273d958993c5d6068deaaf2c2fb701673c90016a3b081b4a6f28300', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 946, hash: '4c472c99ad2afd9549b3d38d7447bd9f8d3c7b232d2d97aa76c23715294d47b4', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'create-event/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/create-event_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 5305, hash: '7c91e0a61c73192cd4ce87a177d96e2efe1f50a8167bac540798d49cad68dec3', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'auth/signup/index.html': {size: 5908, hash: '56bec66cf8a86c30e242d5055f12f8628909b6af2c81a1a57628d398a516c2af', text: () => import('./assets-chunks/auth_signup_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'styles-3XE5QCA3.css': {size: 251, hash: 'UVXQkxqrTSk', text: () => import('./assets-chunks/styles-3XE5QCA3_css.mjs').then(m => m.default)}
  },
};
