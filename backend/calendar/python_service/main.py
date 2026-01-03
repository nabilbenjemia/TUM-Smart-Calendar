from fastapi import FastAPI, HTTPException
from typing import Any, Dict
from anthropic_client import get_llm_client
from config import LLM_PROVIDER

app = FastAPI(title="Calendar LLM (Python)")

client = get_llm_client()


@app.post("/api/llm/process-json")
def process_json(payload: Dict[str, Any]):
    try:
        result = client.process_json(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    # Check python service itself (always true if reached) and LLM connectivity
    ok = client.health_check() if client is not None else False
    return {"service": "ok", "provider": LLM_PROVIDER, "llm": ok}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8082, reload=True)
