package com.wanderlink.matching;

import com.wanderlink.trip.Trip;
import com.wanderlink.trip.TripRepository;
import com.wanderlink.trip.TripService;
import com.wanderlink.user.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service implementing the weighted traveler compatibility algorithm.
 *
 * Matching Formula:
 *   Score = 0.30*D + 0.25*T + 0.20*I + 0.15*B + 0.10*S
 *
 * Where:
 *   D = Destination compatibility (30%)
 *   T = Travel date compatibility (25%)
 *   I = Interests similarity via Jaccard index (20%)
 *   B = Relative budget compatibility (15%)
 *   S = Travel style compatibility (10%)
 */
@Service
@Transactional(readOnly = true)
public class MatchingService {

    private final TripService tripService;
    private final TripRepository tripRepository;

    public MatchingService(TripService tripService, TripRepository tripRepository) {
        this.tripService = tripService;
        this.tripRepository = tripRepository;
    }

    /**
     * Finds and ranks compatible travel buddies for a specific trip.
     */
    public List<MatchDTO> findMatches(Long tripId) {
        Trip baseTrip = tripService.findEntityById(tripId);
        Long requestingUserId = baseTrip.getUser().getId();
        String destination = baseTrip.getDestination().trim();

        List<Trip> candidateTrips = tripRepository.findCandidateTrips(destination, requestingUserId);

        List<MatchDTO> matches = new ArrayList<>();

        for (Trip candidate : candidateTrips) {
            double destinationScore = calculateDestinationScore(baseTrip.getDestination(), candidate.getDestination());

            if (destinationScore == 0.0) {
                continue;
            }

            double dateScore = calculateDateScore(
                    baseTrip.getStartDate(), baseTrip.getEndDate(),
                    candidate.getStartDate(), candidate.getEndDate()
            );

            double interestScore = calculateInterestScore(baseTrip.getInterests(), candidate.getInterests());
            double budgetScore = calculateBudgetScore(baseTrip.getBudget(), candidate.getBudget());
            double travelStyleScore = calculateTravelStyleScore(baseTrip.getTravelStyle(), candidate.getTravelStyle());

            double rawScore = (0.30 * destinationScore)
                    + (0.25 * dateScore)
                    + (0.20 * interestScore)
                    + (0.15 * budgetScore)
                    + (0.10 * travelStyleScore);

            double finalScore = round(rawScore);

            User candidateUser = candidate.getUser();
            MatchDTO match = new MatchDTO(
                    candidateUser.getId(),
                    candidateUser.getName(),
                    candidateUser.getProfileImage(),
                    candidateUser.getLocation(),
                    candidateUser.getBio(),
                    candidate.getInterests(),
                    candidate.getTravelStyle(),
                    candidate.getDestination(),
                    candidate.getStartDate(),
                    candidate.getEndDate(),
                    candidate.getBudget(),
                    round(destinationScore),
                    round(dateScore),
                    round(interestScore),
                    round(budgetScore),
                    round(travelStyleScore),
                    finalScore
            );

            matches.add(match);
        }

        matches.sort((a, b) -> Double.compare(b.getMatchScore(), a.getMatchScore()));
        return matches;
    }

    public double calculateDestinationScore(String dest1, String dest2) {
        if (dest1 == null || dest2 == null) return 0.0;
        return dest1.trim().equalsIgnoreCase(dest2.trim()) ? 100.0 : 0.0;
    }

    public double calculateDateScore(LocalDate start1, LocalDate end1, LocalDate start2, LocalDate end2) {
        if (start1 == null || end1 == null || start2 == null || end2 == null) return 0.0;

        LocalDate overlapStart = start1.isAfter(start2) ? start1 : start2;
        LocalDate overlapEnd = end1.isBefore(end2) ? end1 : end2;

        if (overlapEnd.isBefore(overlapStart)) return 0.0;

        long overlapDays = ChronoUnit.DAYS.between(overlapStart, overlapEnd) + 1;
        long duration1 = ChronoUnit.DAYS.between(start1, end1) + 1;
        long duration2 = ChronoUnit.DAYS.between(start2, end2) + 1;
        long shorterDuration = Math.min(duration1, duration2);

        if (shorterDuration <= 0) return 0.0;

        double score = ((double) overlapDays / (double) shorterDuration) * 100.0;
        return Math.min(100.0, Math.max(0.0, score));
    }

    public double calculateInterestScore(String interests1, String interests2) {
        Set<String> set1 = parseInterests(interests1);
        Set<String> set2 = parseInterests(interests2);

        if (set1.isEmpty() && set2.isEmpty()) return 100.0;
        if (set1.isEmpty() || set2.isEmpty()) return 0.0;

        Set<String> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<String> union = new HashSet<>(set1);
        union.addAll(set2);

        if (union.isEmpty()) return 100.0;

        return ((double) intersection.size() / (double) union.size()) * 100.0;
    }

    public double calculateBudgetScore(Double budget1, Double budget2) {
        if (budget1 == null || budget2 == null) return 50.0;
        if (budget1 <= 0 && budget2 <= 0) return 100.0;

        double maxBudget = Math.max(budget1, budget2);
        if (maxBudget == 0) return 100.0;

        double diff = Math.abs(budget1 - budget2);
        double score = 100.0 - ((diff / maxBudget) * 100.0);
        return Math.min(100.0, Math.max(0.0, score));
    }

    public double calculateTravelStyleScore(String style1, String style2) {
        if (style1 == null || style2 == null) return 50.0;
        return style1.trim().equalsIgnoreCase(style2.trim()) ? 100.0 : 50.0;
    }

    private Set<String> parseInterests(String interests) {
        if (interests == null || interests.trim().isEmpty()) return Collections.emptySet();
        return Arrays.stream(interests.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(2, RoundingMode.HALF_UP).doubleValue();
    }
}
