FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# Shell form so $PORT (injected by Railway) actually expands; falls back to
# 8000 for local `docker run`. Runs pending migrations before the app boots.
CMD alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}