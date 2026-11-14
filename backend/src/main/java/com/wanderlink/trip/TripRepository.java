package com.wanderlink.trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Trip entity.
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {

@Query("SELECT t FROM Trip t WHERE t.user.id = :userId")
    List<Trip> findByUserId(@Param("userId") Long userId);

    List<Trip> findByDestinationIgnoreCase(String destination);

    @Query("SELECT t FROM Trip t WHERE LOWER(TRIM(t.destination)) = LOWER(TRIM(:destination)) AND t.user.id <> :userId")
    List<Trip> findCandidateTrips(@Param("destination") String destination, @Param("userId") Long userId);
}
