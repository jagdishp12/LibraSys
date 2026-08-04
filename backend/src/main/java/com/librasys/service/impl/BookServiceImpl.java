package com.librasys.service.impl;

import com.librasys.dto.*;
import com.librasys.entity.Author;
import com.librasys.entity.Book;
import com.librasys.entity.Category;
import com.librasys.exception.ApiException;
import com.librasys.repository.AuthorRepository;
import com.librasys.repository.BookRepository;
import com.librasys.repository.CategoryRepository;
import com.librasys.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;

    @Autowired
    public BookServiceImpl(BookRepository bookRepository,
                           CategoryRepository categoryRepository,
                           AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.authorRepository = authorRepository;
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "bookById", allEntries = true),
            @CacheEvict(value = "bookSearch", allEntries = true)
    })
    public BookResponse createBook(BookRequest bookRequest) {
        if (bookRepository.existsByIsbn(bookRequest.getIsbn())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Book with ISBN " + bookRequest.getIsbn() + " already exists!");
        }

        Category category = categoryRepository.findById(bookRequest.getCategoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found with id: " + bookRequest.getCategoryId()));

        Author author = authorRepository.findById(bookRequest.getAuthorId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Author not found with id: " + bookRequest.getAuthorId()));

        Book book = Book.builder()
                .title(bookRequest.getTitle())
                .isbn(bookRequest.getIsbn())
                .category(category)
                .author(author)
                .totalCopies(bookRequest.getTotalCopies())
                .availableCopies(bookRequest.getTotalCopies())
                .locationRack(bookRequest.getLocationRack())
                .build();

        Book savedBook = bookRepository.save(book);
        return mapToBookResponse(savedBook);
    }

    @Override
    @Cacheable(value = "bookById", key = "#id")
    public BookResponse getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found with id: " + id));
        return mapToBookResponse(book);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "bookById", key = "#id"),
            @CacheEvict(value = "bookSearch", allEntries = true)
    })
    public BookResponse updateBook(Long id, BookRequest bookRequest) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found with id: " + id));

        Category category = categoryRepository.findById(bookRequest.getCategoryId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Category not found with id: " + bookRequest.getCategoryId()));

        Author author = authorRepository.findById(bookRequest.getAuthorId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Author not found with id: " + bookRequest.getAuthorId()));

        int diff = bookRequest.getTotalCopies() - book.getTotalCopies();
        int newAvailable = book.getAvailableCopies() + diff;
        if (newAvailable < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Cannot decrease total copies below currently issued count.");
        }

        book.setTitle(bookRequest.getTitle());
        book.setIsbn(bookRequest.getIsbn());
        book.setCategory(category);
        book.setAuthor(author);
        book.setTotalCopies(bookRequest.getTotalCopies());
        book.setAvailableCopies(newAvailable);
        book.setLocationRack(bookRequest.getLocationRack());

        Book updatedBook = bookRepository.save(book);
        return mapToBookResponse(updatedBook);
    }

    @Override
    @Caching(evict = {
            @CacheEvict(value = "bookById", key = "#id"),
            @CacheEvict(value = "bookSearch", allEntries = true)
    })
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found with id: " + id));
        bookRepository.delete(book);
    }

    @Override
    @Cacheable(value = "bookSearch", key = "#pageNo + '_' + #pageSize + '_' + #sortBy + '_' + #sortDir + '_' + (#keyword ?: 'all')")
    public PagedResponse<BookResponse> getAllBooks(int pageNo, int pageSize, String sortBy, String sortDir, String keyword) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);

        Page<Book> books;
        if (StringUtils.hasText(keyword)) {
            books = bookRepository.searchBooks(keyword, pageable);
        } else {
            books = bookRepository.findAll(pageable);
        }

        List<BookResponse> content = books.getContent().stream()
                .map(this::mapToBookResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                books.getNumber(),
                books.getSize(),
                books.getTotalElements(),
                books.getTotalPages(),
                books.isLast()
        );
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
