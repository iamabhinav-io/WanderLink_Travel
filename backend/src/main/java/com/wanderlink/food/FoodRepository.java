package com.wanderlink.food;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for FoodListing entity.
 */
@Repository
public interface FoodRepository extends JpaRepository<FoodListing, Long> {

    List<FoodListing> findByLocationContainingIgnoreCase(String location);

    List<FoodListing> findByCuisineContainingIgnoreCase(String cuisine);

    List<FoodListing> findByProviderId(Long providerId);
}
