FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files
COPY . /usr/share/nginx/html

# Remove non-web files from the served directory
RUN rm -f /usr/share/nginx/html/Dockerfile \
         /usr/share/nginx/html/nginx.conf \
         /usr/share/nginx/html/.dockerignore

# Cloud Run uses PORT env variable
# nginx.conf is configured to listen on $PORT (default 8080)
ENV PORT=8080

# Use envsubst to inject PORT into nginx config at runtime
CMD sh -c "envsubst '\$PORT' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp && mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
