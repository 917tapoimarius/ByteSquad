package com.bucketlist.destinations.service;

import java.util.List;
import java.util.Objects;

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

    public List<Destination> getPublicDestinations(Integer pageNumber, Integer pageSize) {
        return destinationRepository.findDestinationsByIsPublic(true, PageRequest.of(pageNumber, pageSize));
    }

    public Long getNumberOfDestinations() {
        return destinationRepository.count();
    }

    public List<Destination> getDestinationsInUserBucketList(Long userId, String filteringAttribute, String filterInputData, Pageable pageable) {
        if (Objects.equals(filteringAttribute, "DestinationName"))
            return destinationRepository.findDestinationsForGivenUserId(userId, "", "", filterInputData, pageable);
        else if (Objects.equals(filteringAttribute, "DestinationCity"))
            return destinationRepository.findDestinationsForGivenUserId(userId, "", filterInputData, "", pageable);
        // DestinationCountry
        return destinationRepository.findDestinationsForGivenUserId(userId, filterInputData, "", "", pageable);
    }

    public Integer getNumberOfDestinationsInUserBucketList(Long userId, String filteringAttribute, String filteringData) {
        return getDestinationsInUserBucketList(userId, filteringAttribute, filteringData, Pageable.unpaged()).size();
    }


    public List<Destination> getPublicDestinationsFiltered(String filteringAttribute, String filterInputData, Pageable pageable) {
        if (filteringAttribute.equals("DestinationName"))
            return destinationRepository.findDestinationByIsPublicAndDestinationNameContainingIgnoreCase(true, filterInputData, pageable);
        else if (filteringAttribute.equals("DestinationCity"))
            return destinationRepository.findDestinationByIsPublicAndDestinationCityContainingIgnoreCase(true, filterInputData, pageable);
        // DestinationCountry
        return destinationRepository.findDestinationByIsPublicAndDestinationCountryContainingIgnoreCase(true, filterInputData, pageable);
    }

    public Integer getNumberOfFilteredPublicDestinations(String filteringAttribute, String filterInputData) {
        return getPublicDestinationsFiltered(filteringAttribute, filterInputData, Pageable.unpaged()).size();
    }
}