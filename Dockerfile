# ==============================================================================
# 1. Base Stage: Node.js 22 LTS Alpine + pnpm + OpenSSL & Libc untuk Prisma
# ==============================================================================
FROM node:22-alpine AS base

# Install dependensi sistem yang dibutuhkan:
# - openssl & libc6-compat: Wajib untuk Prisma Query Engine pada Linux Alpine
# - curl: Dibutuhkan untuk container healthcheck
RUN apk add --no-cache \
    openssl \
    libc6-compat \
    curl

# Aktifkan pnpm v10 via Corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.32.1 --activate

WORKDIR /var/www

# ==============================================================================
# 2. Dependencies Stage: Cache & Install Dependencies + Generate Prisma
# ==============================================================================
FROM base AS dependencies

# Copy package manifests dan Prisma schema (memanfaatkan cache layer Docker)
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Install semua dependencies (termasuk devDependencies untuk build TypeScript)
RUN pnpm install --frozen-lockfile

# ==============================================================================
# 3. Build Stage: Compile TypeScript -> JavaScript (dist/)
# ==============================================================================
FROM dependencies AS build

COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript menjadi file JavaScript siap jalan
RUN pnpm build

# ==============================================================================
# 4. Development Stage: Untuk menjalankan mode dev lokal via Docker Compose
# ==============================================================================
FROM dependencies AS development

ENV NODE_ENV=development

# Siapkan direktori upload Multer
RUN mkdir -p public/images public/files public/videos

# Copy seluruh source code
COPY . .

EXPOSE 3000

# Prisma generate dilakukan ketika container berjalan,
# sehingga DIRECT_URL dari .env sudah tersedia.
CMD ["sh", "-c", "pnpm prisma:generate && pnpm dev"]

# ==============================================================================
# 5. Production Stage: Image final yang ramping, aman, dan efisien
# ==============================================================================
FROM base AS production

ENV NODE_ENV=production

# Siapkan direktori upload Multer
RUN mkdir -p public/images public/files public/videos

# Copy runtime node_modules, generated prisma client, dan build dist
COPY --from=dependencies /var/www/node_modules ./node_modules
COPY --from=dependencies /var/www/src/generated ./src/generated
COPY --from=build /var/www/dist ./dist
COPY package.json ./
COPY public ./public/

# Jalankan dengan user non-root 'node' demi keamanan
RUN chown -R node:node /var/www
USER node

EXPOSE 3000

CMD ["node", "dist/app.js"]
