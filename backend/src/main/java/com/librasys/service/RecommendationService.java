package com.librasys.service;

import com.librasys.dto.BookResponse;

import java.util.List;

public interface RecommendationService {
    List<BookResponse> getRecommendationsForUser(Long userId, int limit);
}
