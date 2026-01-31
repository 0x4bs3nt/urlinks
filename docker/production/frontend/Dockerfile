FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Accept build argument for API URL
ARG VITE_BE_URL
ENV VITE_BE_URL=${VITE_BE_URL}

# Copy package files
COPY web/package.json web/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY web/ .

# Build the application with environment variable
RUN bun run build

# Production stage with nginx
FROM nginx:alpine

RUN apk add --no-cache wget

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/production/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
