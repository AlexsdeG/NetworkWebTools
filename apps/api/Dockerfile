## Builder stage
FROM node:18-alpine AS builder

RUN apk add --no-cache python3 make g++ bash
RUN npm install -g pnpm

WORKDIR /app

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml* ./
COPY tsconfig.json ./

# Copy source
COPY . .

# Clean any host artifacts and install + build
RUN rm -rf node_modules dist || true
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile
RUN pnpm run build

## Production stage
FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy built artifacts and production deps from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=3010

EXPOSE 3010

# Start the compiled app (package.json uses "start": "node dist/main.js")
CMD ["node", "dist/main.js"]
