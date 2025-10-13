# simple static web site served by nginx
# FROM nginx:alpine
# COPY index.html /usr/share/nginx/html/index.html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# Use lightweight Nginx image
FROM nginx:alpine

# Copy all your project files into Nginx's html directory
COPY . /usr/share/nginx/html

# Expose default web server port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
