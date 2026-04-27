package com.agriculture.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    private String title;

    @Column(name = "title_tamil")
    private String titleTamil;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "message_tamil",
            columnDefinition = "TEXT")
    private String messageTamil;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'INFO'")
    private String type;

    @Column(name = "is_read",
            columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean isRead;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.isRead == null) this.isRead = false;
        if (this.type == null) this.type = "INFO";
    }

    // ============ GETTERS ============
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getTitleTamil() { return titleTamil; }
    public String getMessage() { return message; }
    public String getMessageTamil() { return messageTamil; }
    public String getType() { return type; }
    public Boolean getIsRead() { return isRead; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setTitle(String title) { this.title = title; }
    public void setTitleTamil(String titleTamil) {
        this.titleTamil = titleTamil;
    }
    public void setMessage(String message) { this.message = message; }
    public void setMessageTamil(String messageTamil) {
        this.messageTamil = messageTamil;
    }
    public void setType(String type) { this.type = type; }
    public void setIsRead(Boolean isRead) { this.isRead = isRead; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}