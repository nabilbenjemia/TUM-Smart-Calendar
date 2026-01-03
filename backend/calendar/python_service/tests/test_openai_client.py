import os
import sys
import types
import json

# Ensure local package path is discoverable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from anthropic_client import GoogleClient, StudyPlanOutput


class DummyGeminiResponse:
    def __init__(self, text):
        self.text = text


def test_gemini_process_json_calls_generate_content(monkeypatch):
    captured = {}

    def fake_generate_content(model=None, contents=None, config=None):
        captured["model"] = model
        captured["contents"] = contents
        captured["config"] = config

        fake_json = {
            "userId": "1",
            "TimeSlot": [
                {
                    "examId": "301",
                    "title": "Study Operating Systems",
                    "startTime": "2025-04-10T10:00:00",
                    "endTime": "2025-04-10T13:00:00",
                }
            ]
        }

        return DummyGeminiResponse(json.dumps(fake_json))

    # Fake genai client
    fake_models = types.SimpleNamespace(generate_content=fake_generate_content)
    fake_client = types.SimpleNamespace(models=fake_models)

    # Monkeypatch genai.Client to return our fake client
    monkeypatch.setattr(
        "google_client.genai.Client",
        lambda: fake_client
    )

    client = GoogleClient(model="test-model")

    result = client.process_json(
        input_json={"userId": "1", "exams": []},
        schema=StudyPlanOutput
    )

    assert captured["model"] == "test-model"
    assert isinstance(captured["contents"], str)
    assert captured["config"]["temperature"] == 0
    assert isinstance(result, dict)
    assert result["userId"] == "1"