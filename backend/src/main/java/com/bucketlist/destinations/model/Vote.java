package com.bucketlist.destinations.model;

import jakarta.persistence.*;
import lombok.NonNull;

@Entity
@Table(name = "\"Vote\"")
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id", nullable = false)
    private Long voteId;

    @NonNull
    @Column(name = "destination_id")
    private Long destinationId;

    @NonNull
    @Column(name = "month")
    private Integer month;

    @NonNull
    @Column(name = "number")
    private Integer number;

    public Vote(@NonNull Long destinationId, @NonNull Integer month, @NonNull Integer number) {
        this.destinationId = destinationId;
        this.month = month;
        this.number = number;
    }

    public Vote() { }

    public Long getVoteId() {
        return voteId;
    }

    public void setVoteId(Long voteId) {
        this.voteId = voteId;
    }

    public Long getDestinationId() {
        return destinationId;
    }

    public void setDestinationId(Long destinationId) {
        this.destinationId = destinationId;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }
}
