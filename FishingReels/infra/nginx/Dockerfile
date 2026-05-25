# Stage 1: build the React app
FROM node:22-alpine AS frontend-build

WORKDIR /app

# Cache deps in a layer that depends only on package files
COPY apps/frontend/package.json apps/frontend/package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy frontend source and build
COPY apps/frontend/ ./
RUN npm run build
# Produces /app/dist with index.html, assets/

# Stage 2: nginx serving the built SPA + proxying API + serving HLS
FROM nginx:alpine

# Remove the default nginx welcome page
RUN rm /etc/nginx/conf.d/default.conf

# Our top-level config replaces the stock one
COPY infra/nginx/nginx.conf /etc/nginx/nginx.conf
COPY infra/nginx/conf.d/ /etc/nginx/conf.d/

# Built SPA
COPY --from=frontend-build /app/dist /usr/share/nginx/html

# /var/streams is the HLS segment dir. Volume mount in compose.prod.yml fills it.
RUN mkdir -p /var/streams

EXPOSE 80

# nginx:alpine's default CMD is fine: ["nginx", "-g", "daemon off;"]
