package com.librasys.service.impl;

import com.librasys.entity.Transaction;
import com.librasys.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;

    @Autowired
    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    @Async
    public void sendIssueNotification(Transaction transaction) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(transaction.getUser().getEmail());
            message.setSubject("LibraSys - Book Issued Successfully");
            message.setText(String.format("Dear %s,\n\nYou have successfully issued the book: '%s' (ISBN: %s).\n" +
                            "Issue Date: %s\nDue Date: %s\nRack Location: %s\n\nPlease return the book on or before the due date to avoid fines.\n\nHappy Reading!\nTeam LibraSys",
                    transaction.getUser().getFullName(),
                    transaction.getBook().getTitle(),
                    transaction.getBook().getIsbn(),
                    transaction.getIssueDate(),
                    transaction.getDueDate(),
                    transaction.getBook().getLocationRack() != null ? transaction.getBook().getLocationRack() : "N/A"));
            mailSender.send(message);
            log.info("Issue notification email sent to {}", transaction.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send issue notification email to {}: {}", transaction.getUser().getEmail(), e.getMessage());
        }
    }

    @Override
    @Async
    public void sendReturnNotification(Transaction transaction) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(transaction.getUser().getEmail());
            message.setSubject("LibraSys - Book Returned Successfully");
            message.setText(String.format("Dear %s,\n\nYou have successfully returned the book: '%s'.\n" +
                            "Return Date: %s\nFine Incurred: Rs. %s\n\nThank you for returning the book.\n\nTeam LibraSys",
                    transaction.getUser().getFullName(),
                    transaction.getBook().getTitle(),
                    transaction.getReturnDate(),
                    transaction.getFineAmount()));
            mailSender.send(message);
            log.info("Return notification email sent to {}", transaction.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send return notification email to {}: {}", transaction.getUser().getEmail(), e.getMessage());
        }
    }

    @Override
    @Async
    public void sendOverdueAlert(Transaction transaction) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(transaction.getUser().getEmail());
            message.setSubject("LibraSys - OVERDUE BOOK ALERT");
            message.setText(String.format("Dear %s,\n\nThis is a reminder that the book: '%s' was due on %s and is now overdue.\n" +
                            "Please return it immediately to avoid further fines. Fines accrue at Rs. 2.00 per day.\n\nTeam LibraSys",
                    transaction.getUser().getFullName(),
                    transaction.getBook().getTitle(),
                    transaction.getDueDate()));
            mailSender.send(message);
            log.info("Overdue alert email sent to {}", transaction.getUser().getEmail());
        } catch (Exception e) {
            log.error("Failed to send overdue alert email to {}: {}", transaction.getUser().getEmail(), e.getMessage());
        }
    }
}
