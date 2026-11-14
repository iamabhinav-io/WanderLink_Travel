package com.wanderlink.accommodation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Objects for Accommodation listings.
 * Response fields aligned with communityService.js normalizeAccommodation().
 */
public class AccommodationDTO {

    public static class CreateRequest {
        @NotNull(message = "Host ID is required")
        private Long hostId;

        @NotBlank(message = "Title or property name is required")
        @Size(max = 150, message = "Title cannot exceed 150 characters")
        private String title;

        private String propertyName;

        @NotBlank(message = "Location is required")
        @Size(max = 100, message = "Location cannot exceed 100 characters")
        private String location;

        private String description;

        @NotNull(message = "Price per night is required")
        @Positive(message = "Price per night must be positive")
        private Double pricePerNight;

        private String imageUrl;

        public CreateRequest() {}

        public Long getHostId() { return hostId; }
        public void setHostId(Long hostId) { this.hostId = hostId; }

        public String getTitle() { return title != null ? title : propertyName; }
        public void setTitle(String title) { this.title = title; }

        public String getPropertyName() { return propertyName != null ? propertyName : title; }
        public void setPropertyName(String propertyName) { this.propertyName = propertyName; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Double getPricePerNight() { return pricePerNight; }
        public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    }

    /**
     * Response aligned with communityService.js normalizeAccommodation() field names.
     */
    public static class Response {
        private Long id;
        private Long hostId;
        private String hostName;
        private String title;
        private String propertyName;
        private String location;
        private String city;
        private String description;
        private Double pricePerNight;
        private Double price;
        private String imageUrl;
        private Double rating;
        private Integer reviewsCount;
        private String type;
        private String contactPhone;
        private Boolean verified;

        public Response() {}

        public Response(Long id, Long hostId, String hostName, String title,
                        String location, String description, Double pricePerNight, String imageUrl) {
            this.id = id;
            this.hostId = hostId;
            this.hostName = hostName;
            this.title = title;
            this.propertyName = title;
            this.location = location;
            this.city = extractCity(location);
            this.description = description;
            this.pricePerNight = pricePerNight;
            this.price = pricePerNight;
            this.imageUrl = imageUrl;
            this.rating = 4.8;
            this.reviewsCount = 24;
            this.type = "Homestay";
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

        public Long getHostId() { return hostId; }
        public void setHostId(Long hostId) { this.hostId = hostId; }

        public String getHostName() { return hostName; }
        public void setHostName(String hostName) { this.hostName = hostName; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; this.propertyName = title; }

        public String getPropertyName() { return propertyName != null ? propertyName : title; }
        public void setPropertyName(String propertyName) { this.propertyName = propertyName; }

        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }

        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public Double getPricePerNight() { return pricePerNight; }
        public void setPricePerNight(Double pricePerNight) { this.pricePerNight = pricePerNight; this.price = pricePerNight; }

        public Double getPrice() { return price; }
        public void setPrice(Double price) { this.price = price; }

        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

        public Double getRating() { return rating; }
        public void setRating(Double rating) { this.rating = rating; }

        public Integer getReviewsCount() { return reviewsCount; }
        public void setReviewsCount(Integer reviewsCount) { this.reviewsCount = reviewsCount; }

        public String getType() { return type; }
        public void setType(String type) { this.type = type; }

        public String getContactPhone() { return contactPhone; }
        public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

        public Boolean getVerified() { return verified; }
        public void setVerified(Boolean verified) { this.verified = verified; }
    }
}
