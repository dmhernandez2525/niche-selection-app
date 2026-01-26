FROM node:20-alpine

WORKDIR /app

# Install dependencies for all workspaces
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN cd server && npx prisma generate

# Expose ports for server and client
EXPOSE 3000
EXPOSE 5173

# Default command (override in docker-compose)
CMD ["npm", "run", "dev:server"]
