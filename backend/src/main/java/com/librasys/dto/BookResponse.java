package com.librasys.dto;

import java.time.LocalDateTime;

public class BookResponse {

    private Long id;
    private String title;
    private String isbn;
    private CategoryDto category;
    private AuthorDto author;
    private Integer totalCopies;
    private Integer availableCopies;
    private String locationRack;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BookResponse() {
    }

    public BookResponse(Long id, String title, String isbn, CategoryDto category, AuthorDto author, Integer totalCopies, Integer availableCopies, String locationRack, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.isbn = isbn;
        this.category = category;
        this.author = author;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
        this.locationRack = locationRack;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public AuthorDto getAuthor() {
        return author;
    }

    public void setAuthor(AuthorDto author) {
        this.author = author;
    }

    public Integer getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(Integer totalCopies) {
        this.totalCopies = totalCopies;
    }

    public Integer getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(Integer availableCopies) {
        this.availableCopies = availableCopies;
    }

    public String getLocationRack() {
        return locationRack;
    }

    public void setLocationRack(String locationRack) {
        this.locationRack = locationRack;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static BookResponseBuilder builder() {
        return new BookResponseBuilder();
    }

    public static class BookResponseBuilder {
        private Long id;
        private String title;
        private String isbn;
        private CategoryDto category;
        private AuthorDto author;
        private Integer totalCopies;
        private Integer availableCopies;
        private String locationRack;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        BookResponseBuilder() {
        }

        public BookResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BookResponseBuilder title(String title) {
            this.title = title;
            return this;
        }

        public BookResponseBuilder isbn(String isbn) {
            this.isbn = isbn;
            return this;
        }

        public BookResponseBuilder category(CategoryDto category) {
            this.category = category;
            return this;
        }

        public BookResponseBuilder author(AuthorDto author) {
            this.author = author;
            return this;
        }

        public BookResponseBuilder totalCopies(Integer totalCopies) {
            this.totalCopies = totalCopies;
            return this;
        }

        public BookResponseBuilder availableCopies(Integer availableCopies) {
            this.availableCopies = availableCopies;
            return this;
        }

        public BookResponseBuilder locationRack(String locationRack) {
            this.locationRack = locationRack;
            return this;
        }

        public BookResponseBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public BookResponseBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public BookResponse build() {
            return new BookResponse(id, title, isbn, category, author, totalCopies, availableCopies, locationRack, createdAt, updatedAt);
        }
    }
}
