package com.bucketlist.destinations.controller;

import java.util.List;

import com.bucketlist.destinations.exception.NotFoundException;
import com.bucketlist.destinations.exception.ResourceNotFoundException;
import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.model.UserVotes;
import com.bucketlist.destinations.model.Vote;
import com.bucketlist.destinations.service.BucketListService;
import com.bucketlist.destinations.service.DestinationService;


import com.bucketlist.destinations.service.UserVotesService;
import jakarta.transaction.Transactional;
import com.bucketlist.destinations.service.VoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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

    private final UserVotesService userVotesService;

    @Autowired
    public DestinationController(DestinationService destinationService, BucketListService bucketListService,
                                 VoteService voteService, UserVotesService userVotesService) {
        this.destinationService = destinationService;
        this.bucketListService = bucketListService;
        this.voteService = voteService;
        this.userVotesService = userVotesService;
    }

    @PostMapping("/add/{userId}")
    public ResponseEntity<Object> addDestination(@RequestBody Destination destination, @PathVariable Long userId) {
        Destination savedDestination = null;
        try {
            savedDestination = destinationService.addDestination(destination);
        }
        catch (DataIntegrityViolationException e){
            String errorMessage = e.getMostSpecificCause().getMessage();
            System.out.println(ResponseEntity.status(400).body("Error: " + errorMessage));
        }
        System.out.println(savedDestination);
        if ( savedDestination != null) {
            System.out.println("Im here!");
            bucketListService.linkDestinationToUser(userId, savedDestination.getDestinationId(), savedDestination.getDescription());
            voteService.addDefaultDestinationVotes(destination.getDestinationId());
        }
        else {
            try {
                Destination existingDestination = destinationService.findDestinationByNameAndCityAndCountry(destination.getDestinationName(), destination.getDestinationCity(), destination.getDestinationCountry());
                System.out.println(existingDestination);
                bucketListService.linkDestinationToUser(userId, existingDestination.getDestinationId(), destination.getDescription());
            }
            catch (DataIntegrityViolationException e){
                String errorMessage = e.getMostSpecificCause().getMessage();
                System.out.println(ResponseEntity.status(400).body("Error: " + errorMessage));
                return new ResponseEntity<>("Destination already in user's bucket list", HttpStatus.BAD_REQUEST);
            }
            catch (RuntimeException e){
                String errorMessage = e.getMessage();
                System.out.println(ResponseEntity.status(400).body("Error: " + errorMessage));
                return new ResponseEntity<>("Destination already in user's bucket list", HttpStatus.BAD_REQUEST);
            }
        }
        return new ResponseEntity<>(savedDestination, HttpStatus.CREATED);
        //return new ResponseEntity<>("Destination added successfully to bucket list", HttpStatus.CREATED);
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
        bucketListService.linkDestinationToUser(userId, destinationId, destination.getDescription());
        return new ResponseEntity<>("Destination added successfully to bucket list", HttpStatus.CREATED);
    }

    @Transactional
    @PutMapping("/update/{destinationId}")
    public ResponseEntity<Object> updateDestination(@PathVariable Long destinationId, @RequestBody Destination newDestination, @RequestParam Long userId) {
        try{
            Destination updatedDestination = destinationService.updateDestination(destinationId, newDestination, userId);
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
        try {
            destinationService.deleteDestination(destinationId, userId);
            return new ResponseEntity<>("Destination deleted successfully", HttpStatus.OK);
        } catch (NotFoundException exception) {
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception exception) {
            return new ResponseEntity<>("Error occurred while processing the request", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/{destinationId}")
    public ResponseEntity<?> getDestinationDetails(@PathVariable Long destinationId, @RequestParam Long userId) {
        try {
            Destination destination = destinationService.getDestinationDetails(destinationId, userId);
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

    @PutMapping("/voteDestination/{userId}/{destinationId}/{month}")
    public ResponseEntity<Object> voteDestination(@PathVariable Long userId, @PathVariable Long destinationId, @PathVariable Long month) {
        try {
            var voteId = voteService.getVoteByDestinationIdAndMonth(destinationId, month).getVoteId();

            userVotesService.existsUserVotes(userId, voteId); // validates the voting

            UserVotes uv = new UserVotes(userId, voteId);
            userVotesService.addUserVotes(uv);
            Vote updatedVote = voteService.updateVoteNumber(voteId);

            return new ResponseEntity<>(updatedVote, HttpStatus.OK);
        } catch (ResourceNotFoundException exception) {
            return new ResponseEntity<>("Vote not found", HttpStatus.NOT_FOUND);
        } catch (UnsupportedOperationException exception) {
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @GetMapping("/getCoordinatesForDestinationsInBucketList/{userId}")
    public ResponseEntity<Object> getCoordinatesForDestinationsInBucketList(@PathVariable Long userId){
        return new ResponseEntity<>(destinationService.getSetOfCoordinatesForAllDestinations(userId), HttpStatus.OK);
    }
}   
