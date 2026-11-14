package com.wanderlink.group;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for TravelGroup entity.
 */
@Repository
public interface GroupRepository extends JpaRepository<TravelGroup, Long> {

    List<TravelGroup> findByDestinationContainingIgnoreCase(String destination);

    List<TravelGroup> findByCreatedById(Long createdById);
}
