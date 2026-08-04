package com.librasys.repository;

import com.librasys.dto.BookPopularityDto;
import com.librasys.dto.CategoryPopularityDto;
import com.librasys.entity.Transaction;
import com.librasys.entity.TransactionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserId(Long userId);

    Page<Transaction> findByUserId(Long userId, Pageable pageable);

    List<Transaction> findByUserIdAndStatus(Long userId, TransactionStatus status);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.id = :userId AND t.status = 'ISSUED'")
    long countActiveIssuesByUser(@Param("userId") Long userId);

    @Query("SELECT t FROM Transaction t WHERE t.status = 'ISSUED' AND t.dueDate < :currentDate")
    List<Transaction> findOverdueTransactions(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'ISSUED'")
    long countActiveIssues();

    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.status = 'ISSUED' AND t.dueDate < :currentDate")
    long countOverdueBooks(@Param("currentDate") LocalDate currentDate);

    @Query("SELECT COALESCE(SUM(t.fineAmount), 0) FROM Transaction t")
    BigDecimal sumTotalFineCollected();

    @Query("SELECT new com.librasys.dto.BookPopularityDto(t.book.id, t.book.title, t.book.author.name, t.book.category.name, COUNT(t.id)) " +
           "FROM Transaction t GROUP BY t.book.id, t.book.title, t.book.author.name, t.book.category.name " +
           "ORDER BY COUNT(t.id) DESC")
    List<BookPopularityDto> findMostBorrowedBooks(Pageable pageable);

    @Query("SELECT new com.librasys.dto.CategoryPopularityDto(t.book.category.id, t.book.category.name, COUNT(t.id)) " +
           "FROM Transaction t GROUP BY t.book.category.id, t.book.category.name " +
           "ORDER BY COUNT(t.id) DESC")
    List<CategoryPopularityDto> findCategoryPopularity();
}
