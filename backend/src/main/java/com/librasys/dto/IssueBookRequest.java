package com.librasys.dto;

import jakarta.validation.constraints.NotNull;

public class IssueBookRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Book ID is required")
    private Long bookId;

    private Integer daysToKeep = 14;

    public IssueBookRequest() {
    }

    public IssueBookRequest(Long userId, Long bookId, Integer daysToKeep) {
        this.userId = userId;
        this.bookId = bookId;
        this.daysToKeep = daysToKeep != null ? daysToKeep : 14;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public Integer getDaysToKeep() {
        return daysToKeep;
    }

    public void setDaysToKeep(Integer daysToKeep) {
        this.daysToKeep = daysToKeep;
    }
}
