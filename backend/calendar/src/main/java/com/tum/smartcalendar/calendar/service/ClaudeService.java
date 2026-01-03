package com.tum.smartcalendar.calendar.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tum.smartcalendar.calendar.config.AnthropicConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class ClaudeService {

    private static final Logger logger = LoggerFactory.getLogger(ClaudeService.class);

    private final RestTemplate restTemplate;
    private final AnthropicConfig config;
    private final ObjectMapper mapper = new ObjectMapper();

    public ClaudeService(RestTemplate restTemplate, AnthropicConfig config) {
        this.restTemplate = restTemplate;
        this.config = config;
    }

    /**
     * Send the provided JSON to the LLM and attempt to return parsed JSON output.
     * This implementation uses a simple prompt wrapper and returns the LLM response.
     */
    public Map<String, Object> processJson(Map<String, Object> inputJson) {
        try {
            // Forward the user's JSON payload directly to the Python FastAPI service.
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(inputJson, headers);

            String url = config.getPythonServiceUrl();
            ResponseEntity<String> resp = restTemplate.postForEntity(url, entity, String.class);

            String body = resp.getBody();
            if (body == null) {
                return Map.of("error", "empty response from python LLM proxy");
            }

            try {
                JsonNode node = mapper.readTree(body);
                return mapper.convertValue(node, Map.class);
            } catch (JsonProcessingException e) {
                logger.warn("Python service response is not pure JSON, returning raw response. Body: {}", body);
                return Map.of("llm_raw", body);
            }

        } catch (Exception e) {
            logger.error("Error forwarding request to Python service", e);
            return Map.of("error", e.getMessage());
        }
    }
}
