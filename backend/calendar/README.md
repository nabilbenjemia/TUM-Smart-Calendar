# Calendar Modul — Claude Haiku 4.5 Integration

Kurz: Dieses Modul enthält eine einfache Integration zu Anthropic/Claude (Modell `claude-haiku-4.5`).

**Wichtig:** Der mitgelieferte Code verwendet Platzhalter in `application.properties`. Speichere keine echten API-Keys im Repository in Klartext — verwende in Produktion ein Secrets-Management oder Umgebungsvariablen.

**Dateien/Komponenten**
- `src/main/java/com/tum/smartcalendar/calendar/config/AnthropicConfig.java` — Konfigurations-Bean (enthält die konfigurierbare URL zum Python-LLM-Proxy).
- `src/main/java/com/tum/smartcalendar/calendar/config/RestTemplateConfig.java` — `RestTemplate`-Bean.
- `src/main/java/com/tum/smartcalendar/calendar/service/ClaudeService.java` — Service, der JSON an den Python-LLM-Proxy weiterleitet und die Antwort parst.
- `src/main/java/com/tum/smartcalendar/calendar/controller/LlmController.java` — REST-Endpoint `POST /api/llm/process-json`.
- `src/main/resources/application.properties` — enthält `python.service.url` (keine API-Keys im Java-Repo).

Setup & Schnelltest
-------------------

1) Projekt bauen und Modul starten (im Projekt-Root):

```bash
cd backend/calendar
./gradlew bootRun
```

2) Beispiel-Request an den Endpoint (lokal läuft der Service standardmäßig auf Port `8081`):

```bash
curl -X POST http://localhost:8081/api/llm/process-json \
  -H "Content-Type: application/json" \
  -d '{"example":"hello","value":123}'
```

Konfiguration
-------------

- In `src/main/resources/application.properties` gibt es Platzhalter:

```properties
anthropic.api-key=YOUR_API_KEY_HERE
anthropic.model=claude-haiku-4.5
anthropic.endpoint=https://api.anthropic.com/v1/complete
```

- Für lokale Tests kannst du `anthropic.api-key` temporär setzen, aber für sichere Deployments:
  - Nutze Umgebungsvariablen oder einen Secret-Manager.
  - Beispiel (zsh):

```bash
export ANTHROPIC_API_KEY="sk-..."
# dann ./gradlew bootRun (alternativ Key in application.properties ersetzen)
```

Hinweise zum API-Shape
----------------------

Das aktuelle `ClaudeService` sendet einen einfachen JSON-Body mit Feldern `model` und `input` und erwartet vom API-Endpunkt eine JSON-Antwort. Das tatsächliche Anthropic-API-Format kann abweichen (z. B. Wrapper-Felder wie `completion` oder `output`). Falls du Beispiel-Responses von Anthropic/Claude hattest, passe `ClaudeService.processJson(...)` an, um das korrekte Feld auszulesen.

Fehlerbehandlung & Produktion
-----------------------------
- Aktuell: einfache Fehlerbehandlung und rohes Logging.
- Empfehlung für Produktion:
  - Ratenbegrenzung / Throttling
  - Retries + Exponential Backoff
  - Circuit Breaker (z. B. Resilience4j)
  - Metric- und Kostenüberwachung

No Tests
--------
Wie gewünscht wurden keine Tests hinzugefügt. Wenn du später Unit-Tests möchtest, erstelle Mock-Tests für `ClaudeService` (z. B. mit `MockRestServiceServer`) und Integrationstests für den Controller.

Nächste Schritte (optional)
--------------------------
- Response-Parsing an das echte Anthropic-Response-Shape anpassen (sende mir ein Beispiel-Response).
- `WebClient`-Umstellung für reaktive/non-blocking Requests.
- Hinzufügen von Retries/Circuit-Breaker.


Wenn du willst, setze ich das Response-Mapping adaptiv, sobald du ein Beispiel-Response von Claude/Anthropic bereitstellst.

Health Checks
-------------
Ich habe einfache Health-Checks ergänzt:

- Python-Service: `GET /health` prüft die Erreichbarkeit des Dienstes selbst und versucht, kurz mit Anthropic zu kommunizieren. Beispiel:

```bash
curl http://localhost:8082/health
```

- Java-Service: `GET /api/health` prüft die Datenbankverbindung (H2 in-memory standardmäßig) und die Erreichbarkeit des Python-Service (ruft dessen `/health` auf). Beispiel:

```bash
curl http://localhost:8081/api/health
```

Diese Endpoints helfen beim Starten und Debuggen der Verbindungen zwischen Frontend↔Java↔Python↔Anthropic.

---
Date: 3. Dezember 2025
