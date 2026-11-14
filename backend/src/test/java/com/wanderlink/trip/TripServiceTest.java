package com.wanderlink.trip;

import com.wanderlink.common.exception.BadRequestException;
import com.wanderlink.user.User;
import com.wanderlink.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TripServiceTest {

    @Mock
    private TripRepository tripRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private TripService tripService;

    private User sampleUser;
    private TripDTO.CreateRequest tripRequest;

    @BeforeEach
    void setUp() {
        sampleUser = new User("Aarav Sharma", "aarav@test.com", "pass", 26, "Mumbai", "Bio", "Beach", "Budget", "USER");
        sampleUser.setId(1L);

        tripRequest = new TripDTO.CreateRequest();
        tripRequest.setUserId(1L);
        tripRequest.setDestination("Goa");
        tripRequest.setStartDate(LocalDate.of(2026, 12, 20));
        tripRequest.setEndDate(LocalDate.of(2026, 12, 25));
        tripRequest.setBudget(10000.0);
        tripRequest.setInterests("Beach, Photography");
        tripRequest.setTravelStyle("Budget");
        tripRequest.setDescription("Trip to Goa");
    }

    @Test
    @DisplayName("Should successfully create a trip when dates are valid")
    void testCreateTripSuccess() {
        when(userService.findEntityById(1L)).thenReturn(sampleUser);

        Trip savedTrip = new Trip(sampleUser, "Goa", LocalDate.of(2026, 12, 20), LocalDate.of(2026, 12, 25),
                10000.0, "Beach, Photography", "Budget", "Trip to Goa");
        savedTrip.setId(10L);

        when(tripRepository.save(any(Trip.class))).thenReturn(savedTrip);

        TripDTO.Response response = tripService.createTrip(tripRequest);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Goa", response.getDestination());
        assertEquals(1L, response.getUserId());
        verify(tripRepository, times(1)).save(any(Trip.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException when end date is before start date")
    void testCreateTripInvalidDates() {
        tripRequest.setStartDate(LocalDate.of(2026, 12, 25));
        tripRequest.setEndDate(LocalDate.of(2026, 12, 20));

        assertThrows(BadRequestException.class, () -> tripService.createTrip(tripRequest));
        verify(tripRepository, never()).save(any(Trip.class));
    }
}
