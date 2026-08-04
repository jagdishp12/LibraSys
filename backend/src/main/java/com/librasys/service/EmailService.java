package com.librasys.service;

import com.librasys.entity.Transaction;

public interface EmailService {
    void sendIssueNotification(Transaction transaction);
    void sendReturnNotification(Transaction transaction);
    void sendOverdueAlert(Transaction transaction);
}
