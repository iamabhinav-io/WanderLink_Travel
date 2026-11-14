package com.wanderlink.trip;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Data Transfer Objects for Trip operations.
 */
public class TripDTO {

    /**
     * Request payload for trip creation.
     */
    public static class CreateRequest {
        @NotNull(message = "User ID is required")
        private Long userId;

        @NotBlank(message = "Destination is required")
        private String destination;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        @NotNull(message = "End date is required")
        private LocalDate endDate;

        @NotNull(message = "Budget is required")
        @Positive(message = "Budget must be greater than zero")
        private Double budget;

        private String interests;
        private String travelStyle;
        private String description;

        // Frontend aliases
        private LocalDate departureDate;
        private LocalDate returnDate;

        public CreateRequest() {}

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public LocalDate getStartDate() {
            return startDate != null ? startDate : departureDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate != null ? endDate : returnDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public LocalDate getDepartureDate() {
            return departureDate != null ? departureDate : startDate;
        }

        public void setDepartureDate(LocalDate departureDate) {
            this.departureDate = departureDate;
            if (this.startDate == null) {
                this.startDate = departureDate;
            }
        }

        public LocalDate getReturnDate() {
            return returnDate != null ? returnDate : endDate;
        }

        public void setReturnDate(LocalDate returnDate) {
            this.returnDate = returnDate;
            if (this.endDate == null) {
                this.endDate = returnDate;
            }
        }

        public Double getBudget() {
            return budget;
        }

        public void setBudget(Double budget) {
            this.budget = budget;
        }

        public String getInterests() {
            return interests;
        }

        public void setInterests(String interests) {
            this.interests = interests;
        }

        public String getTravelStyle() {
            return travelStyle;
        }

        public void setTravelStyle(String travelStyle) {
            this.travelStyle = travelStyle;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    /**
     * Response payload for trip queries.
     */
    public static class Response {
        private Long id;
        private Long userId;
        private String userName;
        private String userAvatar;
        private String destination;
        private LocalDate startDate;
        private LocalDate endDate;
        private String dates;
        private Double budget;
        private String interests;
        private String travelStyle;
        private String description;
        private LocalDateTime createdAt;

        public Response() {}

        public Response(Long id, Long userId, String userName, String userAvatar, String destination,
                        LocalDate startDate, LocalDate endDate, Double budget, String interests,
                        String travelStyle, String description, LocalDateTime createdAt) {
            this.id = id;
            this.userId = userId;
            this.userName = userName;
            this.userAvatar = userAvatar;
            this.destination = destination;
            this.startDate = startDate;
            this.endDate = endDate;
            this.dates = startDate != null && endDate != null ? startDate + " to " + endDate : "";
            this.budget = budget;
            this.interests = interests;
            this.travelStyle = travelStyle;
            this.description = description;
            this.createdAt = createdAt;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public String getUserAvatar() {
            return userAvatar;
        }

        public void setUserAvatar(String userAvatar) {
            this.userAvatar = userAvatar;
        }

        public String getDestination() {
            return destination;
        }

        public void setDestination(String destination) {
            this.destination = destination;
        }

        public LocalDate getStartDate() {
            return startDate;
        }

        public void setStartDate(LocalDate startDate) {
            this.startDate = startDate;
        }

        public LocalDate getEndDate() {
            return endDate;
        }

        public void setEndDate(LocalDate endDate) {
            this.endDate = endDate;
        }

        public String getDates() {
            return dates;
        }

        public void setDates(String dates) {
            this.dates = dates;
        }

        public Double getBudget() {
            return budget;
        }

        public void setBudget(Double budget) {
            this.budget = budget;
        }

        public String getInterests() {
            return interests;
        }

        public void setInterests(String interests) {
            this.interests = interests;
        }

        public String getTravelStyle() {
            return travelStyle;
        }

        public void setTravelStyle(String travelStyle) {
            this.travelStyle = travelStyle;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public LocalDateTime getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
        }
    }
}
