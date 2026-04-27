package com.agriculture.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subsidies")
public class Subsidy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "scheme_name")
    private String schemeName;

    @Column(name = "scheme_name_tamil")
    private String schemeNameTamil;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "description_tamil",
            columnDefinition = "TEXT")
    private String descriptionTamil;

    private String category;
    private String amount;
    private String eligibility;
    private LocalDate deadline;

    @Column(name = "apply_url")
    private String applyUrl;

    private String state;

    @Column(name = "is_active",
            columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.isActive == null) this.isActive = true;
    }

    // ============ GETTERS ============
    public Long getId() { return id; }
    public String getSchemeName() { return schemeName; }
    public String getSchemeNameTamil() { return schemeNameTamil; }
    public String getDescription() { return description; }
    public String getDescriptionTamil() { return descriptionTamil; }
    public String getCategory() { return category; }
    public String getAmount() { return amount; }
    public String getEligibility() { return eligibility; }
    public LocalDate getDeadline() { return deadline; }
    public String getApplyUrl() { return applyUrl; }
    public String getState() { return state; }
    public Boolean getIsActive() { return isActive; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setSchemeName(String schemeName) {
        this.schemeName = schemeName;
    }
    public void setSchemeNameTamil(String schemeNameTamil) {
        this.schemeNameTamil = schemeNameTamil;
    }
    public void setDescription(String description) {
        this.description = description;
    }
    public void setDescriptionTamil(String descriptionTamil) {
        this.descriptionTamil = descriptionTamil;
    }
    public void setCategory(String category) { this.category = category; }
    public void setAmount(String amount) { this.amount = amount; }
    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public void setApplyUrl(String applyUrl) { this.applyUrl = applyUrl; }
    public void setState(String state) { this.state = state; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}