FROM node:20-alpine

WORKDIR /app

# Copy package files and install deps first (layer caching)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

EXPOSE 3001

# Run as non-root user for security
USER node

CMD ["node", "src/index.js"]