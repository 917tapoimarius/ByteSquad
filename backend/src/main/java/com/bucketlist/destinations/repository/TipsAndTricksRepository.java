package com.bucketlist.destinations.repository;

import com.bucketlist.destinations.model.TipsAndTricks;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TipsAndTricksRepository extends JpaRepository<TipsAndTricks, Long> {
    List<TipsAndTricks> findByDestinationId(Long destinationId);

}
