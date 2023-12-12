package com.bucketlist.destinations.model;

import jakarta.persistence.*;
import lombok.NonNull;

@Entity
@Table(name = "\"Destination\"")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "destination_id", nullable = false)
    private Long destinationId;
    @NonNull
    @Column(name = "destination_country")
    private String destinationCountry;
    @NonNull
    @Column(name = "destination_city")
    private String destinationCity;
    @NonNull
    @Column(name = "is_public")
    private Boolean isPublic;

    @NonNull
    @Column(name = "destination_name")
    private String destinationName;

    @NonNull
    @Column(name = "description")
    private String description;

    public Destination(Long destinationId, @NonNull String destinationCountry, @NonNull String destinationCity, @NonNull boolean isPublic, @NonNull String destinationName, @NonNull String description) {
        this.destinationId = destinationId;
        this.destinationCountry = destinationCountry;
        this.destinationCity = destinationCity;
        this.isPublic = isPublic;
        this.destinationName = destinationName;
        this.description = description;
    }

    public Destination() {

    }

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public String getDestinationCountry() {
        return destinationCountry;
    }

    public void setDestinationCountry(String destinationCountry) {
        this.destinationCountry = destinationCountry;
    }

    public String getDestinationCity() {
        return destinationCity;
    }

    public void setDestinationCity(String destinationCity) {
        this.destinationCity = destinationCity;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        this.isPublic = aPublic;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public String toString() {
        return "Destination with id: " + destinationId + " ,country: " + destinationCountry + ", city: " + destinationCity + ", name: " + destinationName + ", description: " + description;
    }
}