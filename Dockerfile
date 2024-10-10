# Use the official Nginx image from Docker Hub
FROM nginx:alpine

# Copy the HTML and JavaScript files to the Nginx html directory
COPY index.html /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/

# Expose port 80 for the web server
EXPOSE 5000


