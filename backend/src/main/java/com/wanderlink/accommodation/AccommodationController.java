package com.wanderlink.accommodation;

import com.wanderlink.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Accommodation listings.
 */
@RestController
@RequestMapping("/api/accommodations")
public class AccommodationController {

    private final AccommodationService accommodationService;

    public AccommodationController(AccommodationService accommodationService) {
        this.accommodationService = accommodationService;
    }

    /**
     * Retrieves all available local accommodation listings.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<AccommodationDTO.Response>>> getAllAccommodations() {
        List<AccommodationDTO.Response> listings = accommodationService.getAllAccommodations();
        return ResponseEntity.ok(ApiResponse.success("Accommodations retrieved successfully", listings));
    }

    /**
     * Publishes a new accommodation listing.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AccommodationDTO.Response>> addAccommodation(
            @Valid @RequestBody AccommodationDTO.CreateRequest request) {
        AccommodationDTO.Response response = accommodationService.addAccommodation(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Accommodation published successfully", response));
    }
}
