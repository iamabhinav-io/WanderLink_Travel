package com.wanderlink.ai;

import com.wanderlink.ai.dto.AIRequest;
import com.wanderlink.ai.dto.AIResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

/**
 * AI Travel Assistant endpoint.
 * Uses rule-based logic when no external AI API is configured.
 * POST /api/ai/assistant
 */
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @PostMapping("/assistant")
    public ResponseEntity<AIResponse> getAssistantResponse(@Valid @RequestBody AIRequest request) {
        String prompt = request.getMessage().toLowerCase();
        String destination;
        String reply;
        List<String> suggestions;

        if (prompt.contains("manali") || prompt.contains("himachal") || prompt.contains("solang")) {
            destination = "Manali";
            reply = "Here is your 5-day Manali itinerary — perfect for Himalayan trekking and snow adventures!";
            suggestions = Arrays.asList(
                    "Day 1: Arrive, rest at Old Manali, explore Manu Temple",
                    "Day 2: Trek to Jogini Waterfall (3–4 hrs, stunning views)",
                    "Day 3: Solang Valley for paragliding, zorbing, and snow activities",
                    "Day 4: Day trip to Rohtang Pass (book permits in advance)",
                    "Day 5: Hampta Pass base camp hike, return via Kullu for apple orchards",
                    "Try authentic Himachali Siddu and Dham Thali at a local dhaba"
            );
        } else if (prompt.contains("kerala") || prompt.contains("alleppey") || prompt.contains("munnar") || prompt.contains("kochi")) {
            destination = "Kerala";
            reply = "Here is your 5-day Kerala backwaters & hills itinerary — God's Own Country awaits!";
            suggestions = Arrays.asList(
                    "Day 1: Arrive Kochi, explore Fort Kochi, Chinese Fishing Nets, Mattancherry",
                    "Day 2: Drive to Alleppey, check in to houseboat for backwaters cruise",
                    "Day 3: Houseboat sunrise cruise, village walks, local sadhya lunch",
                    "Day 4: Drive to Munnar — tea plantations, Eravikulam National Park",
                    "Day 5: Spice plantation tour, Ayurveda massage, depart",
                    "Must try: Kerala Sadhya on banana leaf, Malabar Fish Curry, Appam with Stew"
            );
        } else if (prompt.contains("jaipur") || prompt.contains("rajasthan") || prompt.contains("pink city")) {
            destination = "Jaipur";
            reply = "Here is your 5-day Jaipur Royal Heritage itinerary — experience the Pink City's grandeur!";
            suggestions = Arrays.asList(
                    "Day 1: Arrive, explore City Palace and Jantar Mantar at sunset",
                    "Day 2: Amber Fort elephant ride, Jaigarh Fort, Nahargarh Fort views",
                    "Day 3: Hawa Mahal photography, local bazaar shopping in Johari Bazar",
                    "Day 4: Birla Mandir, Albert Hall Museum, Chokhi Dhani cultural village",
                    "Day 5: Textile and gem factory tour, street food trail, depart",
                    "Must eat: Dal Baati Churma, Laal Maas, Ghevar dessert, Pyaaz Kachori"
            );
        } else {
            // Default: Goa — the hackathon showcase destination
            destination = "Goa";
            reply = "Here is your 5-day Goa beach & heritage itinerary — sun, sand, and culture!";
            suggestions = Arrays.asList(
                    "Day 1: Arrive, relax on Palolem Beach, sunset at Chapora Fort",
                    "Day 2: North Goa — Baga Beach, Calangute, Anjuna Flea Market",
                    "Day 3: Heritage walk in Fontainhas (Panaji), Old Goa Basilica tour",
                    "Day 4: Dudhsagar Waterfall jeep safari + spice plantation tour",
                    "Day 5: Scuba diving at Grand Island, Morjim Beach for turtles",
                    "Must eat: Goan Fish Thali, Prawn Balchão, Bebinca, Sol Kadhi"
            );
        }

        return ResponseEntity.ok(new AIResponse(reply, destination, suggestions));
    }
}
