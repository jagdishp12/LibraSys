package com.librasys.service.impl;

import com.librasys.dto.AnalyticsDashboardResponse;
import com.librasys.dto.BookPopularityDto;
import com.librasys.dto.CategoryPopularityDto;
import com.librasys.repository.BookRepository;
import com.librasys.repository.TransactionRepository;
import com.librasys.repository.UserRepository;
import com.librasys.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final TransactionRepository transactionRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @Autowired
    public AnalyticsServiceImpl(TransactionRepository transactionRepository,
                                 BookRepository bookRepository,
                                 UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }

    @Override
    public AnalyticsDashboardResponse getDashboardAnalytics() {
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long activeIssues = transactionRepository.countActiveIssues();
        long overdueCount = transactionRepository.countOverdueBooks(LocalDate.now());
        BigDecimal totalFineCollected = transactionRepository.sumTotalFineCollected();

        List<BookPopularityDto> mostBorrowed = transactionRepository.findMostBorrowedBooks(PageRequest.of(0, 5));
        List<CategoryPopularityDto> categoryPopularity = transactionRepository.findCategoryPopularity();

        return AnalyticsDashboardResponse.builder()
                .totalBooks(totalBooks)
                .totalUsers(totalUsers)
                .activeIssuesCount(activeIssues)
                .overdueCount(overdueCount)
                .totalFineCollected(totalFineCollected != null ? totalFineCollected : BigDecimal.ZERO)
                .mostBorrowedBooks(mostBorrowed)
                .categoryPopularity(categoryPopularity)
                .build();
    }
}
