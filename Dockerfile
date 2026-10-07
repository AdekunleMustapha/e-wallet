# ---- base: shared starting point ----
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- dev: hot-reload, source is bind-mounted by docker-compose ----
FROM base AS dev
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]

# ---- build: compile TypeScript to dist/ ----
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# ---- prod: runtime only, no dev dependencies ----
FROM base AS prod
ENV NODE_ENV=production
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
USER node
CMD ["node", "dist/main.js"]