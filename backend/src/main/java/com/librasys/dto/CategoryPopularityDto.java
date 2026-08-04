package com.librasys.dto;

public class CategoryPopularityDto {

    private Long categoryId;
    private String categoryName;
    private Long borrowCount;

    public CategoryPopularityDto() {
    }

    public CategoryPopularityDto(Long categoryId, String categoryName, Long borrowCount) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.borrowCount = borrowCount;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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
