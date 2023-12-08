package com.bucketlist.destinations.service;

import java.util.List;
import java.util.stream.Collectors;
import com.bucketlist.destinations.model.BucketList;
import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.repository.BucketListRepository;
import com.bucketlist.destinations.repository.DestinationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public List<Destination> getAllDestinations(Integer pageNumber, Integer pageSize) {
        return destinationRepository.findAll(PageRequest.of(pageNumber, pageSize)).getContent();
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
}