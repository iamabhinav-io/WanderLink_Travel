package com.wanderlink.accommodation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for Accommodation entity.
 */
@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {

    List<Accommodation> findByLocationContainingIgnoreCase(String location);

    List<Accommodation> findByHostId(Long hostId);
}
