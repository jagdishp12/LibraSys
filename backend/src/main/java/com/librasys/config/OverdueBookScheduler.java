package com.librasys.config;

import com.librasys.entity.Transaction;
import com.librasys.repository.TransactionRepository;
import com.librasys.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class OverdueBookScheduler {

    private static final Logger log = LoggerFactory.getLogger(OverdueBookScheduler.class);

    private final TransactionRepository transactionRepository;
    private final EmailService emailService;

    @Autowired
    public OverdueBookScheduler(TransactionRepository transactionRepository, EmailService emailService) {
        this.transactionRepository = transactionRepository;
        this.emailService = emailService;
    }

    // Runs every day at 1:00 AM
    @Scheduled(cron = "0 0 1 * * ?")
    public void sendOverdueAlerts() {
        log.info("Starting daily overdue books scan...");
        List<Transaction> overdueTransactions = transactionRepository.findOverdueTransactions(LocalDate.now());
        log.info("Found {} overdue transactions", overdueTransactions.size());

        for (Transaction transaction : overdueTransactions) {
            emailService.sendOverdueAlert(transaction);
        }
        log.info("Daily overdue scan and alerting complete.");
    }
}
