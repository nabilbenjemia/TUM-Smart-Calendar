package com.tum.smartcalendar.calendar.controller;

import com.tum.smartcalendar.calendar.service.ClaudeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/llm")
public class LlmController {

    private final ClaudeService claudeService;

    public LlmController(ClaudeService claudeService) {
        this.claudeService = claudeService;
    }

    @PostMapping(path = "/process-json", consumes = "application/json")
    public ResponseEntity<?> processJson(@RequestBody Map<String, Object> payload) {
        Map<String, Object> result = claudeService.processJson(payload);
        return ResponseEntity.ok(result);
    }
}
