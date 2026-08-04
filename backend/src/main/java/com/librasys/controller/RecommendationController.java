package com.librasys.controller;

import com.librasys.dto.BookResponse;
import com.librasys.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    @Autowired
    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookResponse>> getRecommendationsForUser(
            @PathVariable Long userId,
            @RequestParam(value = "limit", defaultValue = "5", required = false) int limit
    ) {
        return ResponseEntity.ok(recommendationService.getRecommendationsForUser(userId, limit));
    }
}
