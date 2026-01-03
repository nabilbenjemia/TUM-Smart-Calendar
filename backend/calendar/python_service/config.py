import os

# Default / placeholder configuration. Prefer setting real values via environment variables.
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "YOUR_API_KEY_HERE")
MODEL = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4.5")
ENDPOINT = os.getenv("ANTHROPIC_ENDPOINT", "https://api.anthropic.com/v1/complete")

# Optional OpenAI configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "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")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

#Google GenAI configuration
GENAI_API_KEY = os.getenv("GENAI_API_KEY", "AIzaSyCXCoRFzF-Tdyir9ICQTKx3HpUBPHq5xBg")
GENAI_MODEL = os.getenv("GENAI_MODEL", "gemini-1.5-pro")

# Choose LLM provider: 'anthropic' or 'openai' (can be overridden via env)
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic")
