package com.tum.smartcalendar.calendar.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.BufferingClientHttpRequestFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        // Buffering request factory so responses can be read multiple times if needed
        return new RestTemplate(new BufferingClientHttpRequestFactory(new SimpleClientHttpRequestFactory()));
    }
}
