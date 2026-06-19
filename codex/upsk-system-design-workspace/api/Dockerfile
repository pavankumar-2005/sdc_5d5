# ---- Stage 1: Builder ----
FROM node:20-slim AS builder

# Install OpenSSL (required by Prisma during generation)
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build --if-present

# Prune devDependencies to keep only production dependencies
RUN npm ci --omit=dev

# ---- Stage 2: Runtime ----
FROM node:20-slim

# Install OpenSSL and curl (required by Prisma and health checks)
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*

# Create a non-root system group and user
RUN groupadd -r appgroup && useradd -r -g appgroup -s /bin/false appuser

WORKDIR /app

# Copy production artifacts from builder with ownership set to the non-root user
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./package.json
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma

# Switch to the non-root user
USER appuser

EXPOSE 3000

# Define a health check targeting our health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

CMD ["node", "dist/main.js"]
