# --- Stage 1: Frontend Build ---
FROM node:18 AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/ ./src/
COPY public/ ./public/
RUN npm run build

# --- Stage 2: Backend ---
FROM python:3.11-slim-buster AS backend

WORKDIR /app

# Copy backend requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the built frontend assets from the frontend-builder stage
COPY build/ ./build/
#COPY --from=frontend-builder /app/build ./static

# Copy the backend application code
COPY main.py ./

# Set environment variable for Cloud Run
ENV PORT 8080
EXPOSE 8080

# Command to run the backend (serving frontend statically)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]