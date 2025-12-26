# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build for production and show what was created
RUN npm run build && \
    echo "=== Checking dist structure ===" && \
    find dist -type f | head -20

# Production stage
FROM nginx:alpine

# Copy built files - Angular with outputMode server creates dist/server for SSR
# For static deployment, we need the browser output which is in dist/browser
COPY --from=builder /app/dist/frontend/browser /usr/share/nginx/html

# Copy custom nginx config for Angular routing
RUN echo 'server { \
    listen 8080; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Make nginx run on port 8080 (non-privileged) for OpenShift
RUN sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf && \
    chmod -R 777 /var/cache/nginx /var/run /var/log/nginx /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
