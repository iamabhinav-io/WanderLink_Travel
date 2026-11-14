package com.wanderlink.ai.dto;

import java.util.List;

/**
 * Response payload for the AI travel assistant endpoint.
 * Contract coordinated with Person 4 (AI developer).
 */
public class AIResponse {

    private String reply;
    private String destination;
    private List<String> suggestions;

    public AIResponse() {}

    public AIResponse(String reply, String destination, List<String> suggestions) {
        this.reply = reply;
        this.destination = destination;
        this.suggestions = suggestions;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }
}
