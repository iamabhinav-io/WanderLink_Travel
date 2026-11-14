package com.wanderlink.matching;

import com.wanderlink.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for traveler matching and compatibility scoring.
 */
@RestController
@RequestMapping("/api/matches")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    /**
     * Calculates and returns ranked travel buddies compatible with the specified trip.
     *
     * @param tripId The ID of the requester's trip
     * @return Ranked list of MatchDTO
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<MatchDTO>>> getMatches(@RequestParam Long tripId) {
        List<MatchDTO> matches = matchingService.findMatches(tripId);
        return ResponseEntity.ok(ApiResponse.success("Compatible travel buddies retrieved successfully", matches));
    }
}
