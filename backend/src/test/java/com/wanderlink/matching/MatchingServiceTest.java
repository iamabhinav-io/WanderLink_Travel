package com.wanderlink.matching;

import com.wanderlink.trip.Trip;
import com.wanderlink.trip.TripRepository;
import com.wanderlink.trip.TripService;
import com.wanderlink.user.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private TripService tripService;

    @Mock
    private TripRepository tripRepository;

    @InjectMocks
    private MatchingService matchingService;

    private User user1;
    private User user2;
    private User user3;
    private Trip baseTrip;
    private Trip highMatchTrip;
    private Trip lowMatchTrip;

    @BeforeEach
    void setUp() {
        user1 = new User("Aarav Sharma", "aarav@test.com", "pass", 26, "Mumbai", "Bio 1", "Beach, Adventure, Photography", "Budget", "USER");
        user1.setId(1L);

        user2 = new User("Priya Patel", "priya@test.com", "pass", 24, "Pune", "Bio 2", "Beach, Adventure, Photography, Food", "Budget", "USER");
        user2.setId(2L);

        user3 = new User("Rohan Gupta", "rohan@test.com", "pass", 28, "Delhi", "Bio 3", "Culture, History", "Luxury", "USER");
        user3.setId(3L);

        baseTrip = new Trip(user1, "Goa", LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 25), 10000.0,
                "Beach, Adventure, Photography", "Budget", "Aarav's trip");
        baseTrip.setId(101L);

        highMatchTrip = new Trip(user2, "Goa", LocalDate.of(2026, 12, 21), LocalDate.of(2026, 12, 25), 11000.0,
                "Beach, Adventure, Photography, Food", "Budget", "Priya's trip");
        highMatchTrip.setId(102L);

        lowMatchTrip = new Trip(user3, "Goa", LocalDate.of(2026, 12, 26), LocalDate.of(2026, 12, 30), 40000.0,
                "Culture, History", "Luxury", "Rohan's trip");
        lowMatchTrip.setId(103L);
    }

    @Test
    @DisplayName("Should correctly calculate destination score")
    void testDestinationScore() {
        assertEquals(100.0, matchingService.calculateDestinationScore("Goa", "Goa"));
        assertEquals(100.0, matchingService.calculateDestinationScore("goa ", " GOA"));
        assertEquals(0.0, matchingService.calculateDestinationScore("Goa", "Manali"));
    }

    @Test
    @DisplayName("Should correctly calculate travel dates overlap compatibility")
    void testDateScore() {
        // Base: Dec 20 to Dec 25 (6 days)
        // Candidate 1: Dec 21 to Dec 25 (5 days). Overlap = 5 days. Shorter duration = 5 days -> 100%
        double scoreOverlap = matchingService.calculateDateScore(
                LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 25),
                LocalDate.of(2026, 12, 21), LocalDate.of(2026, 12, 25)
        );
        assertEquals(100.0, scoreOverlap);

        // Candidate 2: Dec 24 to Dec 28. Overlap = Dec 24, 25 (2 days). Shorter duration = 5 days (Dec 24-28). 2/5 = 40%
        double partialScore = matchingService.calculateDateScore(
                LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 25),
                LocalDate.of(2026, 12, 24), LocalDate.of(2026, 12, 28)
        );
        assertEquals(40.0, partialScore);

        // Candidate 3: Dec 28 to Jan 02 -> No overlap = 0.0
        double noOverlapScore = matchingService.calculateDateScore(
                LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 25),
                LocalDate.of(2026, 12, 28), LocalDate.of(2027, 1, 2)
        );
        assertEquals(0.0, noOverlapScore);
    }

    @Test
    @DisplayName("Should correctly calculate Jaccard similarity for interests")
    void testInterestScore() {
        // "Beach, Adventure, Photography" (3) vs "Beach, Adventure, Photography, Food" (4)
        // Intersection: 3, Union: 4 -> 3/4 * 100 = 75.0%
        double jaccard = matchingService.calculateInterestScore(
                "Beach, Adventure, Photography",
                "Beach, Adventure, Photography, Food"
        );
        assertEquals(75.0, jaccard);

        // Disjoint interests -> 0.0
        double disjoint = matchingService.calculateInterestScore("Beach, Surfing", "History, Museums");
        assertEquals(0.0, disjoint);

        // Both empty -> 100.0
        double bothEmpty = matchingService.calculateInterestScore("", "");
        assertEquals(100.0, bothEmpty);
    }

    @Test
    @DisplayName("Should correctly calculate relative budget difference score")
    void testBudgetScore() {
        // Identical budgets
        assertEquals(100.0, matchingService.calculateBudgetScore(10000.0, 10000.0));

        // 10,000 vs 11,000 -> diff 1,000 / 11,000 = 9.09% diff -> score = 90.91%
        double score = matchingService.calculateBudgetScore(10000.0, 11000.0);
        assertTrue(score > 90.0 && score < 91.0);

        // 10,000 vs 40,000 -> diff 30,000 / 40,000 = 75% diff -> score = 25.0%
        assertEquals(25.0, matchingService.calculateBudgetScore(10000.0, 40000.0));
    }

    @Test
    @DisplayName("Should correctly calculate travel style score")
    void testTravelStyleScore() {
        assertEquals(100.0, matchingService.calculateTravelStyleScore("Budget", "Budget"));
        assertEquals(100.0, matchingService.calculateTravelStyleScore("budget", "BUDGET "));
        assertEquals(50.0, matchingService.calculateTravelStyleScore("Budget", "Luxury"));
    }

    @Test
    @DisplayName("Should rank candidates in descending order and return MatchDTOs")
    void testFindMatchesRanking() {
        when(tripService.findEntityById(101L)).thenReturn(baseTrip);
        when(tripRepository.findCandidateTrips(eq("Goa"), eq(1L)))
                .thenReturn(Arrays.asList(lowMatchTrip, highMatchTrip));

        List<MatchDTO> results = matchingService.findMatches(101L);

        assertNotNull(results);
        assertEquals(2, results.size());

        // High match candidate should be ranked first
        MatchDTO firstMatch = results.get(0);
        MatchDTO secondMatch = results.get(1);

        assertEquals(user2.getId(), firstMatch.getUserId());
        assertEquals("Priya Patel", firstMatch.getFullName());
        assertTrue(firstMatch.getMatchScore() > secondMatch.getMatchScore());
        assertTrue(firstMatch.getMatchScore() >= 90.0);
    }
}
