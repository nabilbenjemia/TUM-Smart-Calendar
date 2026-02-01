# 1. Base image (Python runtime)
FROM python:3.11-slim

# 2. Set working directory inside container
WORKDIR /app

# 3. Copy dependency list first (cache optimization)
COPY py_requirements.txt .

# 4. Install dependencies
RUN pip install --no-cache-dir -r py_requirements.txt

# 5. Copy the rest of the code
COPY . .

# 6. Expose FastAPI port
EXPOSE 8000

# 7. Start the FastAPI server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]