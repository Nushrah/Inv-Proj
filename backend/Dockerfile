FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY prisma ./prisma
COPY --from=build /app/dist ./dist
RUN npx prisma generate
EXPOSE 5000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/server.js"]
