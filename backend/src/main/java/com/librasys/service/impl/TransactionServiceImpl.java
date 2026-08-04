package com.librasys.service.impl;

import com.librasys.dto.*;
import com.librasys.entity.*;
import com.librasys.exception.ApiException;
import com.librasys.repository.BookRepository;
import com.librasys.repository.TransactionRepository;
import com.librasys.repository.UserRepository;
import com.librasys.service.TransactionService;
import com.librasys.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements TransactionService {

    private static final BigDecimal DAILY_FINE_RATE = new BigDecimal("2.00");
    private static final int MAX_ACTIVE_ISSUES_PER_USER = 3;

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final EmailService emailService;

    @Autowired
    public TransactionServiceImpl(TransactionRepository transactionRepository,
                                  UserRepository userRepository,
                                  BookRepository bookRepository,
                                  EmailService emailService) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "bookById", allEntries = true),
            @CacheEvict(value = "bookSearch", allEntries = true),
            @CacheEvict(value = "recommendations", allEntries = true)
    })
    public TransactionResponse issueBook(IssueBookRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found with id: " + request.getUserId()));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Book not found with id: " + request.getBookId()));

        if (book.getAvailableCopies() <= 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Book '" + book.getTitle() + "' is currently out of stock!");
        }

        long activeIssues = transactionRepository.countActiveIssuesByUser(user.getId());
        if (activeIssues >= MAX_ACTIVE_ISSUES_PER_USER) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "User has reached maximum allowed active issues (" + MAX_ACTIVE_ISSUES_PER_USER + ")");
        }

        // Decrement stock
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        LocalDate issueDate = LocalDate.now();
        LocalDate dueDate = issueDate.plusDays(request.getDaysToKeep());

        Transaction transaction = Transaction.builder()
                .user(user)
                .book(book)
                .issueDate(issueDate)
                .dueDate(dueDate)
                .fineAmount(BigDecimal.ZERO)
                .status(TransactionStatus.ISSUED)
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        emailService.sendIssueNotification(savedTransaction);
        return mapToResponse(savedTransaction);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "bookById", allEntries = true),
            @CacheEvict(value = "bookSearch", allEntries = true),
            @CacheEvict(value = "recommendations", allEntries = true)
    })
    public TransactionResponse returnBook(ReturnBookRequest request) {
        Transaction transaction = transactionRepository.findById(request.getTransactionId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Transaction not found with id: " + request.getTransactionId()));

        if (transaction.getStatus() == TransactionStatus.RETURNED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Book has already been returned!");
        }

        LocalDate returnDate = LocalDate.now();
        transaction.setReturnDate(returnDate);

        BigDecimal fineAmount = BigDecimal.ZERO;
        if (returnDate.isAfter(transaction.getDueDate())) {
            long daysOverdue = ChronoUnit.DAYS.between(transaction.getDueDate(), returnDate);
            fineAmount = DAILY_FINE_RATE.multiply(new BigDecimal(daysOverdue));
        }

        transaction.setFineAmount(fineAmount);
        transaction.setStatus(TransactionStatus.RETURNED);

        // Increment stock
        Book book = transaction.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        Transaction updatedTransaction = transactionRepository.save(transaction);
        emailService.sendReturnNotification(updatedTransaction);
        return mapToResponse(updatedTransaction);
    }

    @Override
    public TransactionResponse getTransactionById(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Transaction not found with id: " + id));
        return mapToResponse(transaction);
    }

    @Override
    public List<TransactionResponse> getTransactionsByUserId(Long userId) {
        return transactionRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PagedResponse<TransactionResponse> getAllTransactions(int pageNo, int pageSize, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNo, pageSize, sort);
        Page<Transaction> transactions = transactionRepository.findAll(pageable);

        List<TransactionResponse> content = transactions.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                transactions.getNumber(),
                transactions.getSize(),
                transactions.getTotalElements(),
                transactions.getTotalPages(),
                transactions.isLast()
        );
    }

    @Override
    public List<TransactionResponse> getOverdueTransactions() {
        return transactionRepository.findOverdueTransactions(LocalDate.now()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToResponse(Transaction transaction) {
        User user = transaction.getUser();
        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .createdAt(user.getCreatedAt())
                .build();

        Book book = transaction.getBook();
        AuthorDto authorDto = new AuthorDto(book.getAuthor().getId(), book.getAuthor().getName(), book.getAuthor().getBio());
        CategoryDto categoryDto = new CategoryDto(book.getCategory().getId(), book.getCategory().getName(), book.getCategory().getDescription());

        BookResponse bookResponse = BookResponse.builder()
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

        return TransactionResponse.builder()
                .id(transaction.getId())
                .user(userResponse)
                .book(bookResponse)
                .issueDate(transaction.getIssueDate())
                .dueDate(transaction.getDueDate())
                .returnDate(transaction.getReturnDate())
                .fineAmount(transaction.getFineAmount())
                .status(transaction.getStatus())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
