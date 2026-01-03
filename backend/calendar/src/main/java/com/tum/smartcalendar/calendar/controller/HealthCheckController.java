package com.tum.smartcalendar.calendar.controller;

import com.tum.smartcalendar.calendar.config.AnthropicConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthCheckController {

    private static final Logger logger = LoggerFactory.getLogger(HealthCheckController.class);

    private final DataSource dataSource;
    private final org.springframework.web.client.RestTemplate restTemplate;
    private final AnthropicConfig config;

    public HealthCheckController(DataSource dataSource, org.springframework.web.client.RestTemplate restTemplate, AnthropicConfig config) {
        this.dataSource = dataSource;
        this.restTemplate = restTemplate;
        this.config = config;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> out = new HashMap<>();

        // Check DB
        try (Connection c = dataSource.getConnection()) {
            if (c.isValid(2)) {
                out.put("database", "up");
            } else {
                out.put("database", "down");
            }
        } catch (Exception e) {
            logger.warn("Database health check failed", e);
            out.put("database", "down");
        }

        // Check Python service
        try {
            String url = config.getPythonServiceUrl().replace("/process-json", "/health");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> resp = restTemplate.getForEntity(url, Map.class);
            if (resp.getStatusCode().is2xxSuccessful()) {
                out.put("python_service", resp.getBody());
            } else {
                out.put("python_service", "down");
            }
        } catch (Exception e) {
            logger.warn("Python service health check failed", e);
            out.put("python_service", "down");
        }

        return ResponseEntity.ok(out);
    }
}
