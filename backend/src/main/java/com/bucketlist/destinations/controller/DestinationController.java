package com.bucketlist.destinations.controller;
import java.util.List;

import com.bucketlist.destinations.exception.NotFoundException;
import com.bucketlist.destinations.exception.ResourceNotFoundException;
import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.service.BucketListService;
import com.bucketlist.destinations.service.DestinationService;


import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/destination")
public class DestinationController {
    private final DestinationService destinationService;
    private final BucketListService bucketListService;

    @Autowired
    public DestinationController(DestinationService destinationService, BucketListService bucketListService) {
        this.destinationService = destinationService;
        this.bucketListService = bucketListService;
    }
    @PostMapping("/add/{userId}")
    public ResponseEntity<Object> addDestination(@RequestBody Destination destination, @PathVariable Long userId){
        Destination savedDestination =  destinationService.addDestination(destination, userId);
        bucketListService.linkDestinationToUser(userId, savedDestination.getDestinationId());
        return new ResponseEntity<>("Destination added successfully to bucket list", HttpStatus.CREATED);
    }

    @GetMapping("/allDestinations")
    public ResponseEntity<List<Destination>> getAllDestinations() {
        List<Destination> allDestinations = destinationService.getAllDestinations();
        return new ResponseEntity<>(allDestinations, HttpStatus.OK);
    }

    @GetMapping("/publicDestinations")
    public ResponseEntity<List<Destination>> getPublicDestinations() {
        List<Destination> publicDestinations = destinationService.getPublicDestinations();
        return new ResponseEntity<>(publicDestinations, HttpStatus.OK);
    }

     @GetMapping("/destinationsInBucketList/{userId}")
    public ResponseEntity<List<Destination>> getDestinationsInUserBucketList(@PathVariable Long userId) {
        List<Destination> userBucketListDestinations = destinationService.getDestinationsInUserBucketList(userId);
        return new ResponseEntity<>(userBucketListDestinations, HttpStatus.OK);
    }

    @PostMapping("/dragDrop/{userId}/{destinationId}")
    public ResponseEntity<Object> dragDropDestination(@PathVariable Long userId, @PathVariable Long destinationId) {
        Destination destination = destinationService.getDestinationById(destinationId);
        if(destination == null) {
            return new ResponseEntity<>("Destination not found", HttpStatus.NO_CONTENT);
        }

        //check if the user already has the destination in the bucket list
        if(bucketListService.isDestinationInUserBucketList(userId, destinationId)) {
            return new ResponseEntity<>("Destination already in user's bucket list", HttpStatus.BAD_REQUEST);
        }

        //add the destination to the user's bucket list
        bucketListService.linkDestinationToUser(userId, destinationId);
        return new ResponseEntity<>("Destination added successfully to bucket list", HttpStatus.CREATED);
    }

    @PutMapping("/update/{destinationId}")
    public ResponseEntity<Object> updateDestination(@PathVariable Long destinationId, @RequestBody Destination newDestination) {
        try{
            Destination updatedDestination = destinationService.updateDestination(destinationId, newDestination);
            return new ResponseEntity<>(updatedDestination, HttpStatus.OK);
        } catch (ResourceNotFoundException exception) {
            return new ResponseEntity<>("Destination not found", HttpStatus.NOT_FOUND);
        } catch (UnsupportedOperationException exception) {
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @DeleteMapping("/delete/{userId}/{destinationId}")
    public ResponseEntity<Object> deleteDestination(@PathVariable Long userId, @PathVariable Long destinationId) {
        try{
            destinationService.deleteDestination(destinationId, userId);
            return new ResponseEntity<>("Destination deleted successfully", HttpStatus.OK);
        } catch (NotFoundException exception) {
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            return new ResponseEntity<>("Error occurred while processing the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}   
