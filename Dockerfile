FROM node:22-bookworm-slim AS build

WORKDIR /app

ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run prisma:generate -w @mabe/api
RUN npm run build:api

FROM node:22-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV UPLOAD_DIR=/app/uploads

COPY package.json package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
RUN mkdir -p /app/uploads

EXPOSE 3000

CMD ["npm", "run", "start", "-w", "@mabe/api"]
