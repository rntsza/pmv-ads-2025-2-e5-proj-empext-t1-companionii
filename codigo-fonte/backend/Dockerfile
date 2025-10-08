FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl
COPY package*.json ./
RUN npm i
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# -------- runtime --------
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY prisma ./prisma
COPY package*.json ./
CMD ["npm", "run", "start:prod"]
