package com.wanderlink.trip;

import com.wanderlink.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for Trip operations.
 */
@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    /**
     * Creates a new trip.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<TripDTO.Response>> createTrip(@Valid @RequestBody TripDTO.CreateRequest request) {
        TripDTO.Response response = tripService.createTrip(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trip created successfully", response));
    }

    /**
     * Retrieves all trips.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TripDTO.Response>>> getAllTrips() {
        List<TripDTO.Response> trips = tripService.getAllTrips();
        return ResponseEntity.ok(ApiResponse.success("Trips retrieved successfully", trips));
    }

    /**
     * Retrieves a trip by its ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TripDTO.Response>> getTripById(@PathVariable Long id) {
        TripDTO.Response trip = tripService.getTripById(id);
        return ResponseEntity.ok(ApiResponse.success("Trip retrieved successfully", trip));
    }

    /**
     * Retrieves all trips created by a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TripDTO.Response>>> getTripsByUserId(@PathVariable Long userId) {
        List<TripDTO.Response> trips = tripService.getTripsByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("User trips retrieved successfully", trips));
    }
}
