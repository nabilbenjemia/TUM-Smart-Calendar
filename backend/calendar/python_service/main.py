from fastapi import FastAPI, HTTPException
from typing import Any, Dict
from anthropic_client import GoogleClient
from config import LLM_PROVIDER
from anthropic_client import StudyPlanOutput

app = FastAPI(title="Calendar LLM (Python)")

client = GoogleClient()


@app.post("/api/llm/process-json")
def process_json(payload: Dict[str, Any]):
    try:
        result = client.process_json(payload,schema=StudyPlanOutput)
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
