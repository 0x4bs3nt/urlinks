FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY web/package.json web/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY web/ .

EXPOSE 3000

CMD ["bun", "run", "dev", "--host"]
