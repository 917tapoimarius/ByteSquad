package com.bucketlist.destinations.service;

import com.bucketlist.destinations.model.Vote;
import com.bucketlist.destinations.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoteService {
    protected VoteRepository voteRepository;

    @Autowired
    public VoteService(VoteRepository voteRepository) {
        this.voteRepository = voteRepository;
    }

    public Vote addVote(Vote vote) {
        return this.voteRepository.save(vote);
    }

    public void addDefaultDestinationVotes(Long destinationId) {
        Integer defaultVotes = 0;
        for (int month = 1; month <= 12; month++) {
            this.addVote(new Vote(destinationId, month, defaultVotes));
        }
    }

    public List<Vote> getAllDestinationVotes(Long destinationId) {
        return voteRepository.findDestinationByDestinationId(destinationId);
    }
}
