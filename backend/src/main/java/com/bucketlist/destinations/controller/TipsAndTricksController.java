package com.bucketlist.destinations.controller;

import com.bucketlist.destinations.model.TipsAndTricks;
import com.bucketlist.destinations.service.TipsAndTricksService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/tips")
public class TipsAndTricksController {

    private final TipsAndTricksService tipsAndTricksService;

    @Autowired
    public TipsAndTricksController(TipsAndTricksService tipsAndTricksService) {
        this.tipsAndTricksService = tipsAndTricksService;
    }

    @GetMapping("/destination/{destinationId}")
    public ResponseEntity<List<TipsAndTricks>> getAllTipsForDestination(@PathVariable Long destinationId) {
        List<TipsAndTricks> tipsForDestination = tipsAndTricksService.getAllTipsForDestination(destinationId);
        return new ResponseEntity<>(tipsForDestination, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<TipsAndTricks> addTip(@RequestBody TipsAndTricks tip) {
        TipsAndTricks addedTip = tipsAndTricksService.addTip(tip);
        return new ResponseEntity<>(addedTip, HttpStatus.CREATED);
    }

    @GetMapping("/{tipId}")
    public ResponseEntity<TipsAndTricks> getTipById(@PathVariable Long tipId) {
        Optional<TipsAndTricks> tip = tipsAndTricksService.getTipById(tipId);
        return tip.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/edit/{tipId}")
    public ResponseEntity<TipsAndTricks> editTip(@PathVariable Long tipId,
                                                 @RequestParam Long userId,
                                                 @RequestBody TipsAndTricks updatedTip) {
        try {
            Optional<TipsAndTricks> existingTip = tipsAndTricksService.getTipById(tipId);
            if (existingTip.isPresent()) {
                TipsAndTricks editedTip = tipsAndTricksService.editTip(tipId, userId, updatedTip);
                return new ResponseEntity<>(editedTip, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/delete/{tipId}")
    public ResponseEntity<String> deleteTip(@PathVariable Long tipId,@RequestParam Long userId) {
        try {
            tipsAndTricksService.deleteTip(tipId, userId);
            return new ResponseEntity<>("Tip deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

