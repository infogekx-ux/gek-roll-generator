FROM node:20-slim

WORKDIR /app

# Install dependencies for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci --production

COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/index.js"]
