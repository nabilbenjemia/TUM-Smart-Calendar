from fastapi import FastAPI, HTTPException
from typing import Any, Dict
from anthropic_client import GoogleClient
from config import LLM_PROVIDER
from anthropic_client import StudyPlanOutput
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Calendar LLM (Python)")

client = GoogleClient()


@app.post("/api/llm/process-json")
def process_json(payload: Dict[str, Any]):
    logger.info("=== GENAI REQUEST RECEIVED ===")
    logger.info(f"Payload: {payload}")
    try:
        result = client.process_json(payload,schema=StudyPlanOutput)
        logger.info(f"GenAI Result: {result}")
        return result
    except Exception as e:
        logger.error(f"GenAI Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    # Check python service itself (always true if reached) and LLM connectivity
    ok = client.health_check() if client is not None else False
    return {"service": "ok", "provider": LLM_PROVIDER, "llm": ok}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8082, reload=True)
