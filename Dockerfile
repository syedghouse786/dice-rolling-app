# Stage 1: Build the Angular app
FROM public.ecr.aws/docker/library/node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM public.ecr.aws/nginx/nginx:alpine
RUN apk add --no-cache apache2-utils && \
    htpasswd -cb /etc/nginx/.htpasswd Test Test1234!
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/dice-rolling-app/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
