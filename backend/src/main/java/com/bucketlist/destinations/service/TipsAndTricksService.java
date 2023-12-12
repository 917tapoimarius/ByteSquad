package com.bucketlist.destinations.service;

import com.bucketlist.destinations.model.TipsAndTricks;
import com.bucketlist.destinations.repository.TipsAndTricksRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TipsAndTricksService {

    private final TipsAndTricksRepository tipsAndTricksRepository;

    @Autowired
    public TipsAndTricksService(TipsAndTricksRepository tipsAndTricksRepository) {
        this.tipsAndTricksRepository = tipsAndTricksRepository;
    }

    public List<TipsAndTricks> getAllTipsForDestination(Long destinationId) {
        return tipsAndTricksRepository.findByDestinationId(destinationId);
    }

    public TipsAndTricks addTip(TipsAndTricks tip) {
        return tipsAndTricksRepository.save(tip);
    }

    public Optional<TipsAndTricks> getTipById(Long tipId) {
        return tipsAndTricksRepository.findById(tipId);
    }

    public void deleteTip(Long tipId, Long userId) {
        Optional<TipsAndTricks> optionalTip = tipsAndTricksRepository.findById(tipId);
        if (optionalTip.isPresent()) {
            TipsAndTricks tip = optionalTip.get();
            if (tip.getUserId().equals(userId)) {
                tipsAndTricksRepository.deleteById(tipId);
            } else {
                throw new RuntimeException("Unauthorized deletion of tip");
            }
        } else {
            throw new RuntimeException("Tip not found");
        }
    }

    public TipsAndTricks editTip(Long tipId, Long userId, TipsAndTricks updatedTip) {
        Optional<TipsAndTricks> existingTipOptional = tipsAndTricksRepository.findById(tipId);

        if (existingTipOptional.isPresent()) {
            TipsAndTricks existingTip = existingTipOptional.get();

            if (!existingTip.getUserId().equals(userId)) {
                throw new RuntimeException("You are not authorized to edit this tip.");
            }

            existingTip.setUserId(updatedTip.getUserId());
            existingTip.setDestination(updatedTip.getDestination());
            existingTip.setComment(updatedTip.getComment());

            return tipsAndTricksRepository.save(existingTip);
        } else {
            throw new RuntimeException("Tip not found with id: " + tipId);
        }
    }
}
