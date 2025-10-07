#  Base image with Node.js
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

#  Build the app
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

#  Run the app in production mode
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only what’s needed to run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
