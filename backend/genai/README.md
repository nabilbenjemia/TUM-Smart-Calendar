# Python FastAPI Service — Claude Haiku 4.5 (Calendar Module)

Dieses Verzeichnis enthält einen kleinen, eigenständigen Python-Service (FastAPI), der JSON entgegennimmt, an Anthropic/Claude weiterleitet und die Antwort zurückgibt.

Hinweise
- Läuft separat vom Java Spring-Boot-Service (Standard-Port `8082`) um Portkonflikte zu vermeiden.
- Standardkonfiguration verwendet Platzhalter. Für echte Nutzung setze `ANTHROPIC_API_KEY` als Umgebungsvariable.

Setup

1) Python-Umgebung einrichten (empfohlen: venv):

```bash
cd backend/calendar/python_service
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2) Konfiguration und Start

Setze den API-Key (zsh):

```bash
export ANTHROPIC_API_KEY="sk-..."
```

Starte den Service lokal:

```bash
uvicorn main:app --reload --port 8082
```

3) Beispiel-Request

```bash
curl -X POST http://localhost:8082/api/llm/process-json \
  -H "Content-Type: application/json" \
  -d '{"example":"hello","value":123}'
```

Integration
- Wenn du stattdessen möchtest, dass der Java-Service den Python-Service aufruft, kannst du den Java-Controller anpassen, um Requests an `http://localhost:8082/api/llm/process-json` weiterzuleiten.

Security
- Speichere keine API-Keys im Repo.
- Für Produktion: Secret Manager, Ratenbegrenzung, Retries und Circuit Breaker einsetzen.

Wenn du möchtest, kann ich:
- die Python-Implementierung erweitern, sodass sie genau das Response-Shape von Anthropic/Claude verarbeitet (falls du ein Beispiel hast), oder
- eine einfache Dockerfile hinzufügen, um den Service containerisiert zu starten.

OpenAI Integration (optional)
---------------------------------

Wenn du stattdessen OpenAI verwenden willst, habe ich das Paket `openai` bereits in der lokalen `.venv` installiert und `requirements.txt` aktualisiert (`openai==2.14.0`). So integrierst du OpenAI sauber in dieses Repo:

1) API-Key setzen (zsh) — lokal oder in einer `.env` Datei:

```bash
export OPENAI_API_KEY="sk-..."
# oder in .env: OPENAI_API_KEY=sk-...
```

2) Beispiel-Snippet (Python, `openai` >= 2.x):

```python
from openai import OpenAI
client = OpenAI()
resp = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[{"role":"user","content":"Schreibe ein kurzes Haiku"}],
)
print(resp.choices[0].message.content)
```

3) Empfehlungen:
- Trage `.env` und `.venv/` in `.gitignore` ein (ich habe das bereits unter `calendar/python_service/.gitignore` erledigt).
- Halte `requirements.txt` aktuell (ich habe `openai==2.14.0` ergänzt). Für Reproduzierbarkeit pinne die Versionen.
- Für Produktion: verwende Secret Manager oder CI/CD Secrets statt `.env`.

Wenn du willst, erweitere ich `anthropic_client.py` als Beispiel um eine `openai_client.py` oder füge eine optionale Konfigurationsschicht hinzu, die zwischen Anthropic und OpenAI umschalten kann.
