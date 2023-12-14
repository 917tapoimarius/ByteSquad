package com.bucketlist.destinations.controller;

import java.util.List;

import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.model.Vote;
import com.bucketlist.destinations.service.BucketListService;
import com.bucketlist.destinations.service.DestinationService;


import com.bucketlist.destinations.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/destination")
public class DestinationController {
    private final DestinationService destinationService;
    private final BucketListService bucketListService;
    private final VoteService voteService;

    @Autowired
    public DestinationController(DestinationService destinationService, BucketListService bucketListService, VoteService voteService) {
        this.destinationService = destinationService;
        this.bucketListService = bucketListService;
        this.voteService = voteService;
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Object> addDestination(@RequestBody Destination destination, @PathVariable Long userId) {
        Destination savedDestination = destinationService.addDestination(destination, userId);
        bucketListService.linkDestinationToUser(userId, savedDestination.getDestinationId());
        voteService.addDefaultDestinationVotes(destination.getDestinationId());
        return new ResponseEntity<>("Destination added successfully to bucket list", HttpStatus.CREATED);
    }

    @GetMapping("/allDestinations")
    public ResponseEntity<List<Destination>> getAllDestinations(@RequestParam Integer pageNumber, @RequestParam Integer pageSize) {
        List<Destination> allDestinations = destinationService.getAllDestinations(pageNumber, pageSize);
        return new ResponseEntity<>(allDestinations, HttpStatus.OK);
    }

    @GetMapping("/allDestinations/count")
    public ResponseEntity<Long> getNumberOfDestinations() {
        Long allDestinationsCount = destinationService.getNumberOfDestinations();
        return new ResponseEntity<>(allDestinationsCount, HttpStatus.OK);
    }


    @GetMapping("/destinationsInBucketList/{userId}")
    public ResponseEntity<List<Destination>> getDestinationsInUserBucketList(@PathVariable Long userId, @RequestParam Integer pageNumber, @RequestParam Integer pageSize, @RequestParam String filteringAttribute, @RequestParam(required = false) String filterInputData) {
        if (filterInputData == null)
            filterInputData = "";
        List<Destination> userBucketListDestinations = destinationService.getDestinationsInUserBucketList(userId, filteringAttribute, filterInputData, PageRequest.of(pageNumber, pageSize));
        return new ResponseEntity<>(userBucketListDestinations, HttpStatus.OK);
    }
    @GetMapping("/{destinationId}")
    public ResponseEntity<?> getDestinationDetails(@PathVariable Long destinationId) {
        try {
            Destination destination = destinationService.getDestinationDetails(destinationId);
            return new ResponseEntity<>(destination, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Destination not found", HttpStatus.NOT_FOUND);
        }
    }



    @GetMapping("/destinationsInBucketList/{userId}/count")
    public ResponseEntity<Integer> getNumberOfDestinationsInBucketList(@PathVariable Long userId, @RequestParam String filteringAttribute, @RequestParam(required = false) String filterInputData) {
        if (filterInputData == null)
            filterInputData = "";
        Integer destinationsInBucketListCount = destinationService.getNumberOfDestinationsInUserBucketList(userId, filteringAttribute, filterInputData);
        return new ResponseEntity<>(destinationsInBucketListCount, HttpStatus.OK);
    }

    @GetMapping("/filterPublicDestinations")
    public ResponseEntity<List<Destination>> filterPublicDestinations(@RequestParam String filteringAttribute, @RequestParam(required = false) String filterInputData, @RequestParam Integer pageNumber, @RequestParam Integer pageSize) {
        if (filterInputData == null)
            filterInputData = "";
        List<Destination> filteredPublicDestinations = destinationService.getPublicDestinationsFiltered(filteringAttribute, filterInputData, PageRequest.of(pageNumber, pageSize));
        return new ResponseEntity<>(filteredPublicDestinations, HttpStatus.OK);
    }

    @GetMapping("/filterPublicDestinations/count")
    public ResponseEntity<Integer> getNumberOfFilteredPublicDestinations(@RequestParam String filteringAttribute, @RequestParam(required = false) String filterInputData) {
        if (filterInputData == null)
            filterInputData = "";
        Integer publicDestinationsCount = destinationService.getNumberOfFilteredPublicDestinations(filteringAttribute, filterInputData);
        return new ResponseEntity<>(publicDestinationsCount, HttpStatus.OK);
    }

    @GetMapping("/votes/{destinationId}")
    public ResponseEntity<List<Vote>> getDestinationVotes(@PathVariable Long destinationId) {
        List<Vote> allDestinationVotes = voteService.getAllDestinationVotes(destinationId);
        return new ResponseEntity<>(allDestinationVotes, HttpStatus.OK);
    }
}   
