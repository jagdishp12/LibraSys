package com.librasys.service.impl;

import com.librasys.dto.AuthorDto;
import com.librasys.dto.BookResponse;
import com.librasys.dto.CategoryDto;
import com.librasys.entity.Book;
import com.librasys.exception.ApiException;
import com.librasys.repository.BookRepository;
import com.librasys.repository.UserRepository;
import com.librasys.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public RecommendationServiceImpl(BookRepository bookRepository, UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Cacheable(value = "recommendations", key = "#userId + '_' + #limit")
    public List<BookResponse> getRecommendationsForUser(Long userId, int limit) {
        if (!userRepository.existsById(userId)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "User not found with id: " + userId);
        }

        Set<Book> recommendedBooks = new LinkedHashSet<>();

        List<Long> borrowedBookIds = bookRepository.findBookIdsBorrowedByUser(userId);
        List<Long> borrowedCategoryIds = bookRepository.findCategoryIdsBorrowedByUser(userId);

        if (borrowedBookIds.isEmpty()) {
            // Cold start fallback: Return overall top popular books
            List<Book> popular = bookRepository.findTopPopularBooks(PageRequest.of(0, limit));
            recommendedBooks.addAll(popular);
        } else {
            // Strategy 1: Peer Collaborative Filtering (Books borrowed by similar users)
            List<Book> similarUserBooks = bookRepository.findBooksFromSimilarUsers(userId, borrowedBookIds, PageRequest.of(0, limit));
            recommendedBooks.addAll(similarUserBooks);

            // Strategy 2: Category Preference Matching
            if (recommendedBooks.size() < limit && !borrowedCategoryIds.isEmpty()) {
                List<Book> categoryBooks = bookRepository.findBooksInCategoriesExcluding(
                        borrowedCategoryIds,
                        borrowedBookIds,
                        PageRequest.of(0, limit - recommendedBooks.size())
                );
                recommendedBooks.addAll(categoryBooks);
            }

            // Strategy 3: Global Popularity Fallback
            if (recommendedBooks.size() < limit) {
                List<Book> popularFallback = bookRepository.findTopPopularBooks(PageRequest.of(0, limit));
                for (Book b : popularFallback) {
                    if (!borrowedBookIds.contains(b.getId())) {
                        recommendedBooks.add(b);
                    }
                    if (recommendedBooks.size() >= limit) {
                        break;
                    }
                }
            }
        }

        return recommendedBooks.stream()
                .limit(limit)
                .map(this::mapToBookResponse)
                .collect(Collectors.toList());
    }

    private BookResponse mapToBookResponse(Book book) {
        AuthorDto authorDto = new AuthorDto(book.getAuthor().getId(), book.getAuthor().getName(), book.getAuthor().getBio());
        CategoryDto categoryDto = new CategoryDto(book.getCategory().getId(), book.getCategory().getName(), book.getCategory().getDescription());

        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .isbn(book.getIsbn())
                .category(categoryDto)
                .author(authorDto)
                .totalCopies(book.getTotalCopies())
                .availableCopies(book.getAvailableCopies())
                .locationRack(book.getLocationRack())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
