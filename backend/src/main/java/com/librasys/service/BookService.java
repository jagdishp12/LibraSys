package com.librasys.service;

import com.librasys.dto.BookRequest;
import com.librasys.dto.BookResponse;
import com.librasys.dto.PagedResponse;

public interface BookService {
    BookResponse createBook(BookRequest bookRequest);
    BookResponse getBookById(Long id);
    BookResponse updateBook(Long id, BookRequest bookRequest);
    void deleteBook(Long id);
    PagedResponse<BookResponse> getAllBooks(int pageNo, int pageSize, String sortBy, String sortDir, String keyword);
}
