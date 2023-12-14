package com.bucketlist.destinations.model;

import jakarta.persistence.*;

@Entity
@Table(name = "\"TipsAndTricks\"")
public class TipsAndTricks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tips_and_trick_id")
    private Long tipsAndTrickId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "destination_id")
    private Long destinationId;

    @Column(name = "comment")
    private String comment;

    public TipsAndTricks(Long tipsAndTrickId, Long userId, Long destination, String comment) {
        this.tipsAndTrickId = tipsAndTrickId;
        this.userId = userId;
        this.destinationId = destination;
        this.comment = comment;
    }

    public TipsAndTricks() {
    }



    public Long getTipsAndTrickId() {
        return tipsAndTrickId;
    }

    public Long getUserId() {
        return userId;
    }

    public Long getDestination() {
        return destinationId;
    }

    public String getComment() {
        return comment;
    }

    public void setTipsAndTrickId(Long tipsAndTrickId) {
        this.tipsAndTrickId = tipsAndTrickId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setDestination(Long destination) {
        this.destinationId = destination;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}


