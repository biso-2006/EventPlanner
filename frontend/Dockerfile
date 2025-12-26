# Use nginx to serve pre-built static files
FROM nginx:alpine

# Copy pre-built Angular app from dist folder
COPY dist/frontend/browser /usr/share/nginx/html

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
