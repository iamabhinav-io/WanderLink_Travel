package com.wanderlink.food;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTOs for Food Listings.
 * Response fields aligned with communityService.js normalizeFood().
 */
public class FoodDTO {

    public static class CreateRequest {
        @NotNull(message = "Provider ID is required")
        private Long providerId;

        @NotBlank(message = "Title is required")
        private String title;

        @NotBlank(message = "Cuisine type is required")
        private String cuisine;

        @NotBlank(message = "Location is required")
        private String location;

        @NotNull(message = "Price is required")
        @Positive(message = "Price must be positive")
        private Double price;

        private String description;
        private String imageUrl;

        public CreateRequest() {}

        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getCuisine() { return cuisine; }
        public void setCuisine(String cuisine) { this.cuisine = cuisine; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    /**
     * Response aligned with communityService.js normalizeFood() field names.
     */
    public static class Response {
        private Long id;
        private Long providerId;
        private String providerName;
        private String name;
        private String title;
        private String cuisine;
        private String cuisineType;
        private String location;
        private String city;
        private Double price;
        private String description;
        private String imageUrl;
        private Double rating;
        private Integer reviewsCount;
        private String dietaryType;
        private String mealType;
        private String contactPhone;
        private Boolean verified;

        public Response() {}

        public Response(Long id, Long providerId, String providerName, String title,
                        String cuisine, String location, Double price,
                        String description, String imageUrl) {
            this.id = id;
            this.providerId = providerId;
            this.providerName = providerName;
            this.title = title;
            this.name = title;
            this.cuisine = cuisine;
            this.cuisineType = cuisine;
            this.location = location;
            this.city = extractCity(location);
            this.price = price;
            this.description = description;
            this.imageUrl = imageUrl;
            this.rating = 4.9;
            this.reviewsCount = 32;
            this.dietaryType = "Local Traditional";
            this.mealType = "Meal Experience";
            this.contactPhone = "+91 98765 43210";
            this.verified = true;
        }

        private String extractCity(String location) {
            if (location == null) return "India";
            String[] parts = location.split(",");
            return parts.length > 1 ? parts[parts.length - 1].trim() : location.trim();
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public Long getProviderId() { return providerId; }
        public void setProviderId(Long providerId) { this.providerId = providerId; }

        public String getProviderName() { return providerName; }
        public void setProviderName(String providerName) { this.providerName = providerName; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; this.title = name; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; this.name = title; }

        public String getCuisine() { return cuisine; }
        public void setCuisine(String cuisine) { this.cuisine = cuisine; this.cuisineType = cuisine; }

        public String getCuisineType() { return cuisineType; }
        public void setCuisineType(String cuisineType) { this.cuisineType = cuisineType; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public Integer getReviewsCount() { return reviewsCount; }
        public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

        public String getDietaryType() { return dietaryType; }
        public void setDietaryType(String dietaryType) { this.dietaryType = dietaryType; }

        public String getMealType() { return mealType; }
        public void setMealType(String mealType) { this.mealType = mealType; }

        public String getContactPhone() { return contactPhone; }
        public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

        public Boolean getVerified() { return verified; }
        public void setVerified(Boolean verified) { this.verified = verified; }
    }
}
