package com.wanderlink.matching;

import java.time.LocalDate;
import java.util.List;

/**
 * Data Transfer Object representing traveler compatibility matching result.
 * Fields match the BuddyCard props spec from INTEGRATION_GUIDE.md:
 *   id, name, avatar, destination, dates, travelStyle, budget, matchScore, interests, bio
 */
public class MatchDTO {

    private Long userId;
    private String fullName;
    private String name;
    private String avatar;
    private String profileImage;
    private String location;
    private String bio;
    private String interests;
    private String travelStyle;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private String dates;
    private Double budget;
    private String budgetLabel;

    // Component scores (0–100)
    private Double destinationScore;
    private Double dateScore;
    private Double interestScore;
    private Double budgetScore;
    private Double travelStyleScore;

    // Weighted overall compatibility score (0–100)
    private Double matchScore;

    // Human-readable explanation
    private String compatibilityExplanation;

    public MatchDTO() {}

    public MatchDTO(Long userId, String name, String avatar, String location, String bio,
                    String interests, String travelStyle, String destination,
                    LocalDate startDate, LocalDate endDate, Double budget,
                    Double destinationScore, Double dateScore, Double interestScore,
                    Double budgetScore, Double travelStyleScore, Double matchScore) {
        this.userId = userId;
        this.name = name;
        this.fullName = name;
        this.avatar = avatar;
        this.profileImage = avatar;
        this.location = location;
        this.bio = bio;
        this.interests = interests;
        this.travelStyle = travelStyle;
        this.destination = destination;
        this.startDate = startDate;
        this.endDate = endDate;
        this.dates = startDate != null && endDate != null ? startDate + " – " + endDate : "";
        this.budget = budget;
        this.budgetLabel = budget != null ? formatBudgetLabel(budget) : "Flexible";
        this.destinationScore = destinationScore;
        this.dateScore = dateScore;
        this.interestScore = interestScore;
        this.budgetScore = budgetScore;
        this.travelStyleScore = travelStyleScore;
        this.matchScore = matchScore;
        this.compatibilityExplanation = buildExplanation(destinationScore, dateScore, interestScore, budgetScore, travelStyleScore);
    }

    private String formatBudgetLabel(Double budget) {
        if (budget <= 5000) return "Budget Friendly";
        if (budget <= 15000) return "Moderate";
        if (budget <= 30000) return "Comfortable";
        return "Luxury";
    }

    private String buildExplanation(Double d, Double t, Double i, Double b, Double s) {
        List<String> strengths = new java.util.ArrayList<>();
        if (d != null && d >= 100) strengths.add("same destination");
        if (t != null && t >= 70) strengths.add("overlapping travel dates");
        if (i != null && i >= 50) strengths.add("common interests");
        if (b != null && b >= 70) strengths.add("compatible budgets");
        if (s != null && s >= 100) strengths.add("matching travel style");
        if (strengths.isEmpty()) return "Some compatibility found";
        return "Strong match on: " + String.join(", ", strengths);
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; this.name = fullName; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; this.fullName = name; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; this.profileImage = avatar; }

    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; this.avatar = profileImage; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getTravelStyle() { return travelStyle; }
    public void setTravelStyle(String travelStyle) { this.travelStyle = travelStyle; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getDates() { return dates; }
    public void setDates(String dates) { this.dates = dates; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public String getBudgetLabel() { return budgetLabel; }
    public void setBudgetLabel(String budgetLabel) { this.budgetLabel = budgetLabel; }

    public Double getDestinationScore() { return destinationScore; }
    public void setDestinationScore(Double destinationScore) { this.destinationScore = destinationScore; }

    public Double getDateScore() { return dateScore; }
    public void setDateScore(Double dateScore) { this.dateScore = dateScore; }

    public Double getInterestScore() { return interestScore; }
    public void setInterestScore(Double interestScore) { this.interestScore = interestScore; }

    public Double getBudgetScore() { return budgetScore; }
    public void setBudgetScore(Double budgetScore) { this.budgetScore = budgetScore; }

    public Double getTravelStyleScore() { return travelStyleScore; }
    public void setTravelStyleScore(Double travelStyleScore) { this.travelStyleScore = travelStyleScore; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public String getCompatibilityExplanation() { return compatibilityExplanation; }
    public void setCompatibilityExplanation(String compatibilityExplanation) { this.compatibilityExplanation = compatibilityExplanation; }
}
