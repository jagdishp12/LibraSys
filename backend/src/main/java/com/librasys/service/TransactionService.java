package com.librasys.service;

import com.librasys.dto.IssueBookRequest;
import com.librasys.dto.PagedResponse;
import com.librasys.dto.ReturnBookRequest;
import com.librasys.dto.TransactionResponse;

import java.util.List;

public interface TransactionService {
    TransactionResponse issueBook(IssueBookRequest request);
    TransactionResponse returnBook(ReturnBookRequest request);
    TransactionResponse getTransactionById(Long id);
    List<TransactionResponse> getTransactionsByUserId(Long userId);
    PagedResponse<TransactionResponse> getAllTransactions(int pageNo, int pageSize, String sortBy, String sortDir);
    List<TransactionResponse> getOverdueTransactions();
}
