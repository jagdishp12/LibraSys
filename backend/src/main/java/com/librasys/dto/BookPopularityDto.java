package com.librasys.dto;

public class BookPopularityDto {

    private Long bookId;
    private String title;
    private String authorName;
    private String categoryName;
    private Long borrowCount;

    public BookPopularityDto() {
    }

    public BookPopularityDto(Long bookId, String title, String authorName, String categoryName, Long borrowCount) {
        this.bookId = bookId;
        this.title = title;
        this.authorName = authorName;
        this.categoryName = categoryName;
        this.borrowCount = borrowCount;
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getBorrowCount() {
        return borrowCount;
    }

    public void setBorrowCount(Long borrowCount) {
        this.borrowCount = borrowCount;
    }
}
