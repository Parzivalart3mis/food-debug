package com.zosh.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;

import java.util.List;
import java.util.Map;

@Service
public class AIAgentService {

    @Value("${openai.api-key}")
    private String openAiKey;

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Calls OpenAI to extract origin/destination from a free‑form query.
     *
     * @param userQuery e.g. "Fastest route from A to B"
     * @return a Map with keys "origin" and "destination"
     */
    public Map<String, String> parseRouteQuery(String userQuery) {
        String prompt = "Extract origin and destination from this text as JSON:\n\n\""
                + userQuery
                + "\"\n\nReturn only: {\"origin\":\"…\", \"destination\":\"…\"}";
        String url = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(openAiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "model", "gpt-3.5-turbo",
                "messages", List.of(Map.of("role","user","content", prompt)),
                "max_tokens", 60
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        Map<String, Object> aiResponse = rest.postForObject(url, request, Map.class);

        // Navigate into the response to grab the assistant’s text
        @SuppressWarnings("unchecked")
        Map<String, Object> choice = ((List<Map<String, Object>>) aiResponse.get("choices")).get(0);
        String content = ((Map<String, String>) choice.get("message")).get("content");

        try {
            // Parse JSON string into Map<String,String>
            return objectMapper.readValue(
                    content,
                    new TypeReference<Map<String, String>>() {}
            );
        } catch (JsonProcessingException e) {
            // You can log more details or wrap in a custom exception if you prefer
            throw new RuntimeException(
                    "Failed to parse AI JSON response: " + content, e
            );
        }
    }
}
