FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts
COPY . .
RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache wget && rm -f /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=2s --start-period=5s CMD wget -q -O /dev/null http://127.0.0.1:80/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
