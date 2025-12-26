
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
    'index.csr.html': {size: 809, hash: 'ac67ba455b32aa08df3f6f9934f0a85bbe3872290660622ae8a7effefffbbec2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 946, hash: 'fffa63444b5fca05d9ccfafe40afcab5c45c97cd51a4e7a2b3b81ea08d38c90c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'create-event/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/create-event_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'auth/signup/index.html': {size: 5908, hash: 'da7295d775c63f91a1c1153a2390d995654c3e825f7331c64241b27288fae8c8', text: () => import('./assets-chunks/auth_signup_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 5305, hash: '0ba16ddbac8feaab8ec4b85ff3e542e365d89b6f9243a0ee217cd05d5deb07cf', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'styles-3XE5QCA3.css': {size: 251, hash: 'UVXQkxqrTSk', text: () => import('./assets-chunks/styles-3XE5QCA3_css.mjs').then(m => m.default)}
  },
};
