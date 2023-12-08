package com.bucketlist.destinations.repository;

import com.bucketlist.destinations.model.Destination;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DestinationRepository extends JpaRepository<Destination, Long> {
    List<Destination> findDestinationsByIsPublic(boolean isPublic);
}
