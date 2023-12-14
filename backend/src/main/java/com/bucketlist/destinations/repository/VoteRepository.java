package com.bucketlist.destinations.repository;

import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.model.Vote;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findDestinationByDestinationId(Long destinationId);
}
