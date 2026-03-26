FROM node:22-bookworm-slim

# Install OpenSSL for Prisma, curl for health checks, build tools for sqlite3/native modules, pip for notebooklm
RUN apt-get update -y && apt-get install -y openssl curl python3 python3-pip make g++ && rm -rf /var/lib/apt/lists/*

# Install NotebookLM CLI for Athena research agent
RUN pip3 install --break-system-packages notebooklm-py

WORKDIR /app

# Copy package descriptors
COPY package.json ./

# Install dependencies via npm to safely run post-install scripts (Prisma/sqlite3) bypassing strict pnpm 10 checks
RUN npm install --legacy-peer-deps && npm cache clean --force && rm -rf ~/.npm

# Copy application code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate



# Expose the standard ZAP-Claw ports
EXPOSE 3001 8000 3300 3301

# Default fallback command
CMD ["npm", "start"]
