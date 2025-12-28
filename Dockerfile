FROM node:20-alpine

# create non-root user
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Install dependencies first
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .
#COPY .env ./
# UI will be added later (safe if missing)
COPY ui ./ui
# Switch User
USER app

# Expose port
EXPOSE 3000

# Run the actual process (PID 1)
CMD ["node", "src/server.js"]