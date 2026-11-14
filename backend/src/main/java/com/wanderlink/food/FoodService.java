package com.wanderlink.food;

import com.wanderlink.user.User;
import com.wanderlink.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FoodService {

    private final FoodRepository foodRepository;
    private final UserService userService;

    public FoodService(FoodRepository foodRepository, UserService userService) {
        this.foodRepository = foodRepository;
        this.userService = userService;
    }

    @Transactional(readOnly = true)
    public List<FoodDTO.Response> getAllFoodListings() {
        return foodRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public FoodDTO.Response addFoodListing(FoodDTO.CreateRequest request) {
        User provider = userService.findEntityById(request.getProviderId());

        FoodListing listing = new FoodListing(
                provider,
                request.getTitle().trim(),
                request.getCuisine().trim(),
                request.getLocation().trim(),
                request.getPrice(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getImageUrl() != null ? request.getImageUrl().trim() : ""
        );

        FoodListing saved = foodRepository.save(listing);
        return mapToResponse(saved);
    }

    public FoodDTO.Response mapToResponse(FoodListing listing) {
        User provider = listing.getProvider();
        return new FoodDTO.Response(
                listing.getId(),
                provider.getId(),
                provider.getName(),
                listing.getTitle(),
                listing.getCuisine(),
                listing.getLocation(),
                listing.getPrice(),
                listing.getDescription(),
                listing.getImageUrl()
        );
    }
}
