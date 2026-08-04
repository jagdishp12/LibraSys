package com.librasys.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class BookRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 1, max = 150, message = "Title must be between 1 and 150 characters")
    private String title;

    @NotBlank(message = "ISBN is required")
    @Size(min = 10, max = 20, message = "ISBN must be valid length")
    private String isbn;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotNull(message = "Author ID is required")
    private Long authorId;

    @NotNull(message = "Total copies is required")
    @Min(value = 1, message = "Total copies must be at least 1")
    private Integer totalCopies;

    private String locationRack;

    public BookRequest() {
    }

    public BookRequest(String title, String isbn, Long categoryId, Long authorId, Integer totalCopies, String locationRack) {
        this.title = title;
        this.isbn = isbn;
        this.categoryId = categoryId;
        this.authorId = authorId;
        this.totalCopies = totalCopies;
        this.locationRack = locationRack;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Long getAuthorId() {
        return authorId;
    }

    public void setAuthorId(Long authorId) {
        this.authorId = authorId;
    }

    public Integer getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(Integer totalCopies) {
        this.totalCopies = totalCopies;
    }

    public String getLocationRack() {
        return locationRack;
    }

    public void setLocationRack(String locationRack) {
        this.locationRack = locationRack;
    }
}
