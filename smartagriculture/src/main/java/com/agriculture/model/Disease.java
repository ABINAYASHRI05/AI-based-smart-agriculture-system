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
@Table(name = "disease_detections")
public class Disease {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "disease_name")
    private String diseaseName;

    @Column(columnDefinition = "TEXT")
    private String treatment;

    private Double confidence;

    @Column(name = "image_path")
    private String imagePath;

    private String severity;

    @Column(name = "detected_at")
    private LocalDateTime detectedAt;

    @PrePersist
    public void prePersist() {
        this.detectedAt = LocalDateTime.now();
    }

    // ============ GETTERS ============
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getDiseaseName() { return diseaseName; }
    public String getTreatment() { return treatment; }
    public Double getConfidence() { return confidence; }
    public String getImagePath() { return imagePath; }
    public String getSeverity() { return severity; }
    public LocalDateTime getDetectedAt() { return detectedAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }
    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }
    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    public void setSeverity(String severity) { this.severity = severity; }
    public void setDetectedAt(LocalDateTime detectedAt) {
        this.detectedAt = detectedAt;
    }
}