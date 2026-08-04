package com.librasys.repository;

import com.librasys.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);

    Boolean existsByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.author.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Book> searchBooks(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT DISTINCT t.book.category.id FROM Transaction t WHERE t.user.id = :userId")
    List<Long> findCategoryIdsBorrowedByUser(@Param("userId") Long userId);

    @Query("SELECT DISTINCT t.book.id FROM Transaction t WHERE t.user.id = :userId")
    List<Long> findBookIdsBorrowedByUser(@Param("userId") Long userId);

    @Query("SELECT b FROM Book b WHERE b.category.id IN :categoryIds AND b.id NOT IN :excludedBookIds")
    List<Book> findBooksInCategoriesExcluding(@Param("categoryIds") List<Long> categoryIds, 
                                              @Param("excludedBookIds") List<Long> excludedBookIds, 
                                              Pageable pageable);

    @Query("SELECT b FROM Book b WHERE b.id IN " +
           "(SELECT t2.book.id FROM Transaction t2 WHERE t2.user.id IN " +
           "(SELECT DISTINCT t1.user.id FROM Transaction t1 WHERE t1.book.id IN :userBookIds AND t1.user.id != :userId) " +
           "AND t2.book.id NOT IN :userBookIds)")
    List<Book> findBooksFromSimilarUsers(@Param("userId") Long userId, 
                                         @Param("userBookIds") List<Long> userBookIds, 
                                         Pageable pageable);

    @Query("SELECT b FROM Book b ORDER BY (b.totalCopies - b.availableCopies) DESC")
    List<Book> findTopPopularBooks(Pageable pageable);
}
