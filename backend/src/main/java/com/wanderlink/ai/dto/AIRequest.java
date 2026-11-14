package com.wanderlink.ai.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for the AI travel assistant endpoint.
 * Contract coordinated with Person 4 (AI developer).
 */
public class AIRequest {

    @NotBlank(message = "Message prompt cannot be empty")
    private String message;

    public AIRequest() {}

    public AIRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
