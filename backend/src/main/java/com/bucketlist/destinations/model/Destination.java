package com.bucketlist.destinations.model;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;
import lombok.NonNull;

@Entity
@Table(name = "\"Destination\"")
public class Destination {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "destination_id", nullable = false)
    @Schema(hidden = true)
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

    public Destination(Long destinationId, @NonNull String destinationCountry, @NonNull String destinationCity, @NonNull boolean isPublic) {
        this.destinationId = destinationId;
        this.destinationCountry = destinationCountry;
        this.destinationCity = destinationCity;
        this.isPublic = isPublic;
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
}
