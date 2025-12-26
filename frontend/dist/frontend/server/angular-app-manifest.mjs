
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
    'index.csr.html': {size: 809, hash: 'd8d3c9245092ed38935248a77c1918527c2550f5ccd0dc2b583b316fd9c67c24', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 946, hash: '84ee8449d25ec858c1637da47a95ba9cf38587525bd40e26a3a658b1ef47525a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'auth/signup/index.html': {size: 5908, hash: '39283c073b590b577d23e53497e1406beb00535fa0887e38c77b6e18b1fb5cec', text: () => import('./assets-chunks/auth_signup_index_html.mjs').then(m => m.default)},
    'auth/login/index.html': {size: 5305, hash: '8d7e4c832284867116d6299961ebb46bed2c71c9ed541cce53f440ee6fcd19d6', text: () => import('./assets-chunks/auth_login_index_html.mjs').then(m => m.default)},
    'create-event/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/create-event_index_html.mjs').then(m => m.default)},
    'home/index.html': {size: 0, hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', text: () => import('./assets-chunks/home_index_html.mjs').then(m => m.default)},
    'styles-3XE5QCA3.css': {size: 251, hash: 'UVXQkxqrTSk', text: () => import('./assets-chunks/styles-3XE5QCA3_css.mjs').then(m => m.default)}
  },
};
