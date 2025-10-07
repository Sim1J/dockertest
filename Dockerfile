# Use official lightweight NGINX image
FROM nginx:stable-alpine

# Copy your site’s files into NGINX’s default public directory
COPY . /usr/share/nginx/html

# Expose port 80 (the web port)
EXPOSE 80

# Run NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
