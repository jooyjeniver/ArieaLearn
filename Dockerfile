FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Use npm install instead of npm ci to avoid dependency issues
RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"] 