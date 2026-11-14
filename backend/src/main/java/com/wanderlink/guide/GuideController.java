package com.wanderlink.guide;

import com.wanderlink.common.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Local Guides.
 * GET /api/guides        – all guides
 * GET /api/guides/{id}   – single guide
 */
@RestController
@RequestMapping("/api/guides")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping
    public ResponseEntity<List<Guide>> getAllGuides() {
        // Return raw list so communityService.js normalizeGuide() can read all fields directly
        return ResponseEntity.ok(guideService.getAllGuides());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Guide>> getGuideById(@PathVariable Long id) {
        Guide guide = guideService.getGuideById(id);
        return ResponseEntity.ok(ApiResponse.success("Guide retrieved successfully", guide));
    }
}
