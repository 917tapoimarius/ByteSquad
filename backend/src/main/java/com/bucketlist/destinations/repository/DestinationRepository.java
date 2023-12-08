package com.bucketlist.destinations.repository;

import com.bucketlist.destinations.model.Destination;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findDestinationsByIsPublic(boolean isPublic, Pageable pageable);

    @Query(value = "SELECT d.destination_id, d.destination_country, d.destination_city, d.is_public, d.description, d.destination_name\n" +
            "FROM \"Destination\" d\n" +
            "\tINNER JOIN \"BucketList\" bl ON d.destination_id = bl.destination_id\n" +
            "WHERE bl.user_id = ?1", nativeQuery = true)
    List<Destination> findDestinationsForGivenUserId(Long userId, Pageable pageable);
}
