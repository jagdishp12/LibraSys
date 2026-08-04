package com.librasys.dto;

import jakarta.validation.constraints.NotNull;

public class ReturnBookRequest {

    @NotNull(message = "Transaction ID is required")
    private Long transactionId;

    public ReturnBookRequest() {
    }

    public ReturnBookRequest(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }
}
