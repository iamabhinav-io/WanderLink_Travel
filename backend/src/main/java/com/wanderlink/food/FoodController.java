package com.wanderlink.food;

import com.wanderlink.common.response.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for homemade food listings.
 */
@RestController
@RequestMapping("/api/food")
public class FoodController {

    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    /**
     * Retrieves all homemade food experience listings.
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodDTO.Response>>> getAllFood() {
        List<FoodDTO.Response> listings = foodService.getAllFoodListings();
        return ResponseEntity.ok(ApiResponse.success("Food listings retrieved successfully", listings));
    }

    /**
     * Publishes a new homemade food experience listing.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<FoodDTO.Response>> addFood(
            @Valid @RequestBody FoodDTO.CreateRequest request) {
        FoodDTO.Response response = foodService.addFoodListing(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Food listing published successfully", response));
    }
}
