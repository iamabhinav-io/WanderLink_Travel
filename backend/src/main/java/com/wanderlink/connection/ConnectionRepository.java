package com.wanderlink.connection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA Repository for Connection entity.
 */
@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c FROM Connection c WHERE (c.sender.id = :userId OR c.receiver.id = :userId) ORDER BY c.createdAt DESC")
    List<Connection> findAllForUser(@Param("userId") Long userId);

    @Query("SELECT c FROM Connection c WHERE " +
           "((c.sender.id = :user1Id AND c.receiver.id = :user2Id) OR (c.sender.id = :user2Id AND c.receiver.id = :user1Id)) " +
           "AND c.status = 'PENDING'")
    Optional<Connection> findPendingBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}
