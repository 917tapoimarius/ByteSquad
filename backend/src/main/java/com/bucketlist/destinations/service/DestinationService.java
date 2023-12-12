package com.bucketlist.destinations.service;

import java.util.List;
import java.util.stream.Collectors;
import com.bucketlist.destinations.model.BucketList;
import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.repository.BucketListRepository;
import com.bucketlist.destinations.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DestinationService {
    protected DestinationRepository destinationRepository;
    protected BucketListRepository bucketListRepository;

    @Autowired
    public DestinationService(DestinationRepository destinationRepository, BucketListRepository bucketListRepository) {
        this.destinationRepository = destinationRepository;
        this.bucketListRepository = bucketListRepository;
    }

    public Destination addDestination(Destination destination, Long userId) {
        return this.destinationRepository.save(destination);
    }

    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }

    public List<Destination> getPublicDestinations() {
        return destinationRepository.findDestinationsByIsPublic(true);
    }

    public List<Destination> getDestinationsInUserBucketList(Long userId) {
        List<BucketList> userBucketList = bucketListRepository.findBucketListByBucketListPK_UserId(userId);
        List<Long> destinationIds = userBucketList.stream()
                .map(bucketList -> bucketList.getBucketListPK().getDestinationId())
                .collect(Collectors.toList());
        return destinationRepository.findAllById(destinationIds);
    }

    public Destination getDestinationDetails(Long destinationId) {
        return destinationRepository.findById(destinationId)
                .orElseThrow(() -> new RuntimeException("Destination not found with id: " + destinationId));
    }
}