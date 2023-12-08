package com.bucketlist.destinations.controller;

import java.util.List;

import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.service.BucketListService;
import com.bucketlist.destinations.service.DestinationService;


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
    public ResponseEntity<Object> addDestination(@RequestBody Destination destination, @PathVariable Long userId) {
        Destination savedDestination = destinationService.addDestination(destination, userId);
        bucketListService.linkDestinationToUser(userId, savedDestination.getDestinationId());
        return new ResponseEntity<>("Destination added successfully to bucket list", HttpStatus.CREATED);
    }

    @GetMapping("/allDestinations")
    public ResponseEntity<List<Destination>> getAllDestinations(@RequestParam Integer pageNumber, @RequestParam Integer pageSize) {
        List<Destination> allDestinations = destinationService.getAllDestinations(pageNumber, pageSize);
        return new ResponseEntity<>(allDestinations, HttpStatus.OK);
    }

    @GetMapping("/publicDestinations")
    public ResponseEntity<List<Destination>> getPublicDestinations(@RequestParam Integer pageNumber, @RequestParam Integer pageSize) {
        List<Destination> publicDestinations = destinationService.getPublicDestinations(pageNumber, pageSize);
        return new ResponseEntity<>(publicDestinations, HttpStatus.OK);
    }

    @GetMapping("/destinationsInBucketList/{userId}")
    public ResponseEntity<List<Destination>> getDestinationsInUserBucketList(@PathVariable Long userId, @RequestParam Integer pageNumber, @RequestParam Integer pageSize) {
        List<Destination> userBucketListDestinations = destinationService.getDestinationsInUserBucketList(userId, pageNumber, pageSize);
        return new ResponseEntity<>(userBucketListDestinations, HttpStatus.OK);
    }
}   
