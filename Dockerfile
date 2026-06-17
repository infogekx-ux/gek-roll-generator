FROM node:20-slim

WORKDIR /app

# Install dependencies for sharp
RUN apt-get update && apt-get install -y --no-install-recommends \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package.json ./
RUN npm install --production

COPY src/ ./src/

EXPOSE 3000

# --expose-gc lets the generator force-free native sharp buffers between segments (OOM fix)
CMD ["node", "--expose-gc", "src/index.js"]
