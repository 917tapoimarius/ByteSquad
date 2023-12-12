package com.bucketlist.destinations.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.bucketlist.destinations.exception.NotFoundException;
import com.bucketlist.destinations.exception.ResourceNotFoundException;
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

    public Destination getDestinationById(Long destinationId) {
        return destinationRepository.findById(destinationId).orElse(null);
    }

    public Destination updateDestination(Long destinationId, Destination newDestination) {
        System.out.println("Received newDestination: " + newDestination.toString());
        Destination existingDestination = destinationRepository.findById(destinationId).orElseThrow(() -> new ResourceNotFoundException("Destination with id: " + destinationId + " not found"));

        if(existingDestination.isPublic()) {
            throw new UnsupportedOperationException("Public destinations cannot be edited!");
        }

        existingDestination.setDestinationCountry(newDestination.getDestinationCountry());
        existingDestination.setDestinationCity(newDestination.getDestinationCity());
        existingDestination.setDestinationName(newDestination.getDestinationName());
        existingDestination.setDescription(newDestination.getDescription());

        return destinationRepository.save(existingDestination);
    }

    public void deleteDestination(Long destinationId, Long userId) {
        Optional<Destination> destinationOptional = destinationRepository.findById(destinationId);

        if(destinationOptional.isPresent()) {
            Destination destination = destinationOptional.get();
            System.out.println("Is public");
            bucketListRepository.deleteByBucketListPK_UserIdAndBucketListPK_DestinationId(userId, destinationId);
            System.out.println("Deleted from BL");

            if(!destination.isPublic()) {
                System.out.println("Is not public");
                destinationRepository.deleteById(destinationId);
                System.out.println("Deleted from destination table");
            }

//            if(destination.isPublic()) {
//                System.out.println("is public");
//                bucketListRepository.deleteByBucketListPK_UserIdAndBucketListPK_DestinationId(userId, destinationId);
//                System.out.println("deleted from BL");
//            }
//            else{
//                System.out.println("is not public");
//                bucketListRepository.deleteByBucketListPK_UserIdAndBucketListPK_DestinationId(userId, destinationId);
//                destinationRepository.deleteById(destinationId);
//            }
        }
        else{
            throw new NotFoundException("Destination with ID: " + destinationId + " not found.");
        }
    }
}