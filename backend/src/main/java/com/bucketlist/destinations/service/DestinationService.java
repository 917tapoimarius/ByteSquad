package com.bucketlist.destinations.service;

import java.io.IOException;
import java.text.MessageFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.bucketlist.destinations.exception.NotFoundException;
import com.bucketlist.destinations.exception.ResourceNotFoundException;
import com.bucketlist.destinations.model.BucketList;

import java.util.Objects;
import java.util.logging.Logger;

import com.bucketlist.destinations.model.Destination;
import com.bucketlist.destinations.model.GoogleMapsAPI.DestinationCoordinates;
import com.bucketlist.destinations.model.GoogleMapsAPI.GeocodingResponse;
import com.bucketlist.destinations.model.GoogleMapsAPI.Geometry;
import com.bucketlist.destinations.repository.BucketListRepository;
import com.bucketlist.destinations.repository.DestinationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.java.Log;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DestinationService {
    @Value("${GEOCODING_URL}")
    private String GEOCODING_URL;

    @Value("${GOOGLE_MAPS_API_KEY}")
    private String GOOGLE_MAPS_API_KEY;

    protected DestinationRepository destinationRepository;
    protected BucketListRepository bucketListRepository;

    @Autowired
    public DestinationService(DestinationRepository destinationRepository, BucketListRepository bucketListRepository) {
        this.destinationRepository = destinationRepository;
        this.bucketListRepository = bucketListRepository;
    }

    public Destination addDestination(Destination destination) {
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

    public Destination getDestinationDetails(Long destinationId, Long userId) {
        Destination destination = destinationRepository.findById(destinationId).orElseThrow(() -> new RuntimeException("Destination not found with id: " + destinationId));
        if (destination.isPublic()) return destination;
        BucketList.BucketListPK bucketListPK = new BucketList.BucketListPK(destinationId, userId);
        destination.setDescription(bucketListRepository.findBucketListByBucketListPK(bucketListPK).getDescription());
        return destination;
    }

    public Destination getDestinationById(Long destinationId) {
        return destinationRepository.findById(destinationId).orElse(null);
    }

    public Destination updateDestination(Long destinationId, Destination newDestination, Long userId) {
        System.out.println("Received newDestination: " + newDestination.toString());
        Destination selectedDestination = destinationRepository.findById(destinationId).orElseThrow(() -> new ResourceNotFoundException("Destination with id: " + destinationId + " not found"));
        Destination existingDestination = findDestinationByNameAndCityAndCountry(newDestination.getDestinationName(), newDestination.getDestinationCity(), newDestination.getDestinationCountry());

        // Selected destination is public
        if (selectedDestination.isPublic()) {
            System.out.println("Case0");
            throw new UnsupportedOperationException("Public destinations cannot be edited!");
        }

        // New destination exists and is public
        if (existingDestination != null && existingDestination.isPublic()) {
            System.out.println("Case1");
            throw new UnsupportedOperationException("Destination already exists as a public destination!");
        }

        // New destination is private, but exists in the bucket list
        if (existingDestination != null && bucketListRepository.existsByBucketListPK_UserIdAndBucketListPK_DestinationId(userId, existingDestination.getDestinationId())) {
            System.out.println("Case2");
            throw new UnsupportedOperationException("Destination already exists in your bucket list!");
        }

        // New destination exists in destination table only or does not exist at all
        // We delete the existing bucket list entry
        var bucketListPK = new BucketList.BucketListPK(userId, selectedDestination.getDestinationId());
        BucketList bucketListEntry = bucketListRepository.findBucketListByBucketListPK(bucketListPK);

        if (existingDestination != null && !bucketListRepository.existsByBucketListPK_UserIdAndBucketListPK_DestinationId(userId, existingDestination.getDestinationId())) {
            // If it exists already, we do not add it again in the destination table, we just edit the existing one
            System.out.println("Case3");
            bucketListRepository.update(existingDestination.getDestinationId(), newDestination.getDescription(), bucketListEntry.getDestinationInListId());
            return newDestination;
        }

        // New destination did not exist
        System.out.println("Case4");
        Destination confirmedNewDestination = destinationRepository.save(newDestination);
        bucketListRepository.update(newDestination.getDestinationId(), newDestination.getDescription(), bucketListEntry.getDestinationInListId());
        return confirmedNewDestination;
    }

    public void deleteDestination(Long destinationId, Long userId) {
        Optional<Destination> destinationOptional = destinationRepository.findById(destinationId);

        if (destinationOptional.isPresent()) {
            Destination destination = destinationOptional.get();
            System.out.println("Is public");
            bucketListRepository.deleteByBucketListPK_UserIdAndBucketListPK_DestinationId(userId, destinationId);
            System.out.println("Deleted from BL");

            if (!destination.isPublic() && bucketListRepository.countBucketListByBucketListPK_DestinationId(destinationId) == 0) {
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
        } else {
            throw new NotFoundException("Destination with ID: " + destinationId + " not found.");
        }
    }

    public Destination findDestinationByNameAndCityAndCountry(String destinationName, String destinationCity, String destinationCountry) {
        return destinationRepository.findDestinationByDestinationNameAndDestinationCityAndDestinationCountry(destinationName, destinationCity, destinationCountry);
    }

    private GeocodingResponse parseResponse(String response) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            return objectMapper.readValue(response, GeocodingResponse.class);
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public DestinationCoordinates getDestinationCoordinates(String destinationCity, String destinationCountry) {
        String url = GEOCODING_URL;
        String requestBody = MessageFormat.format("+{0},+{1}&key={2}", destinationCity, destinationCountry, GOOGLE_MAPS_API_KEY);

        // Create an HTTP POST request
        HttpPost post = new HttpPost(url + requestBody);

        // Execute a HTTP POST request
        try (CloseableHttpClient httpClient = HttpClients.custom().build();
             CloseableHttpResponse response = httpClient.execute(post)) {

            // Read the response body as a string
            String responseBody = EntityUtils.toString(response.getEntity());
            System.out.println("Response body: " + responseBody);

            // Extract and return the coordinates from the response
            GeocodingResponse geocodingResponse = parseResponse(responseBody.toString());
            if (geocodingResponse != null && geocodingResponse.getResults() != null && !geocodingResponse.getResults().isEmpty()) {
                Geometry geometry = geocodingResponse.getResults().get(0).getGeometry();
                return new DestinationCoordinates(geometry.getLocation().getLat(), geometry.getLocation().getLng());
            } else {
                throw new Exception("No results are found for the given address.");
            }

        } catch (Exception e) {
            return new DestinationCoordinates();
        }
    }

    public List<DestinationCoordinates> getSetOfCoordinatesForAllDestinations(Long userId) {
        List<DestinationCoordinates> destinationCoordinates = new ArrayList<>();

        for (var destination : getDestinationsInUserBucketList(userId, "", "", Pageable.unpaged())) {
            var currentDestinationCoordinates = getDestinationCoordinates(destination.getDestinationCity(), destination.getDestinationCountry());

            if (
                    currentDestinationCoordinates.getLatitude() != 0 &&
                            currentDestinationCoordinates.getLongitude() != 0
                            && !destinationCoordinates.contains(currentDestinationCoordinates)
            )
                destinationCoordinates.add(currentDestinationCoordinates);
        }

        return destinationCoordinates;
    }
}