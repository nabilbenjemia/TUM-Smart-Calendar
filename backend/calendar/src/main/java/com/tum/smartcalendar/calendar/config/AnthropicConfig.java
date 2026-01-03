package com.tum.smartcalendar.calendar.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AnthropicConfig {

    @Value("${python.service.url:http://localhost:8082/api/llm/process-json}")
    private String pythonServiceUrl;

    public String getPythonServiceUrl() {
        return pythonServiceUrl;
    }
}
