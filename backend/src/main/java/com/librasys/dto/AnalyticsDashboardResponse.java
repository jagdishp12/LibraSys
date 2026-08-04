package com.librasys.dto;

import java.math.BigDecimal;
import java.util.List;

public class AnalyticsDashboardResponse {

    private long totalBooks;
    private long totalUsers;
    private long activeIssuesCount;
    private long overdueCount;
    private BigDecimal totalFineCollected;
    private List<BookPopularityDto> mostBorrowedBooks;
    private List<CategoryPopularityDto> categoryPopularity;

    public AnalyticsDashboardResponse() {
    }

    public AnalyticsDashboardResponse(long totalBooks, long totalUsers, long activeIssuesCount, long overdueCount, BigDecimal totalFineCollected, List<BookPopularityDto> mostBorrowedBooks, List<CategoryPopularityDto> categoryPopularity) {
        this.totalBooks = totalBooks;
        this.totalUsers = totalUsers;
        this.activeIssuesCount = activeIssuesCount;
        this.overdueCount = overdueCount;
        this.totalFineCollected = totalFineCollected;
        this.mostBorrowedBooks = mostBorrowedBooks;
        this.categoryPopularity = categoryPopularity;
    }

    public long getTotalBooks() {
        return totalBooks;
    }

    public void setTotalBooks(long totalBooks) {
        this.totalBooks = totalBooks;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveIssuesCount() {
        return activeIssuesCount;
    }

    public void setActiveIssuesCount(long activeIssuesCount) {
        this.activeIssuesCount = activeIssuesCount;
    }

    public long getOverdueCount() {
        return overdueCount;
    }

    public void setOverdueCount(long overdueCount) {
        this.overdueCount = overdueCount;
    }

    public BigDecimal getTotalFineCollected() {
        return totalFineCollected;
    }

    public void setTotalFineCollected(BigDecimal totalFineCollected) {
        this.totalFineCollected = totalFineCollected;
    }

    public List<BookPopularityDto> getMostBorrowedBooks() {
        return mostBorrowedBooks;
    }

    public void setMostBorrowedBooks(List<BookPopularityDto> mostBorrowedBooks) {
        this.mostBorrowedBooks = mostBorrowedBooks;
    }

    public List<CategoryPopularityDto> getCategoryPopularity() {
        return categoryPopularity;
    }

    public void setCategoryPopularity(List<CategoryPopularityDto> categoryPopularity) {
        this.categoryPopularity = categoryPopularity;
    }

    public static AnalyticsDashboardResponseBuilder builder() {
        return new AnalyticsDashboardResponseBuilder();
    }

    public static class AnalyticsDashboardResponseBuilder {
        private long totalBooks;
        private long totalUsers;
        private long activeIssuesCount;
        private long overdueCount;
        private BigDecimal totalFineCollected;
        private List<BookPopularityDto> mostBorrowedBooks;
        private List<CategoryPopularityDto> categoryPopularity;

        AnalyticsDashboardResponseBuilder() {
        }

        public AnalyticsDashboardResponseBuilder totalBooks(long totalBooks) {
            this.totalBooks = totalBooks;
            return this;
        }

        public AnalyticsDashboardResponseBuilder totalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
            return this;
        }

        public AnalyticsDashboardResponseBuilder activeIssuesCount(long activeIssuesCount) {
            this.activeIssuesCount = activeIssuesCount;
            return this;
        }

        public AnalyticsDashboardResponseBuilder overdueCount(long overdueCount) {
            this.overdueCount = overdueCount;
            return this;
        }

        public AnalyticsDashboardResponseBuilder totalFineCollected(BigDecimal totalFineCollected) {
            this.totalFineCollected = totalFineCollected;
            return this;
        }

        public AnalyticsDashboardResponseBuilder mostBorrowedBooks(List<BookPopularityDto> mostBorrowedBooks) {
            this.mostBorrowedBooks = mostBorrowedBooks;
            return this;
        }

        public AnalyticsDashboardResponseBuilder categoryPopularity(List<CategoryPopularityDto> categoryPopularity) {
            this.categoryPopularity = categoryPopularity;
            return this;
        }

        public AnalyticsDashboardResponse build() {
            return new AnalyticsDashboardResponse(totalBooks, totalUsers, activeIssuesCount, overdueCount, totalFineCollected, mostBorrowedBooks, categoryPopularity);
        }
    }
}
