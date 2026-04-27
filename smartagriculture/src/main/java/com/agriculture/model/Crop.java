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
@Table(name = "crop_recommendations")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "recommended_crop")
    private String recommendedCrop;

    private Double confidence;
    private Double nitrogen;
    private Double phosphorus;
    private Double potassium;
    private Double temperature;
    private Double humidity;
    private Double ph;
    private Double rainfall;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    // ============ GETTERS ============
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getRecommendedCrop() { return recommendedCrop; }
    public Double getConfidence() { return confidence; }
    public Double getNitrogen() { return nitrogen; }
    public Double getPhosphorus() { return phosphorus; }
    public Double getPotassium() { return potassium; }
    public Double getTemperature() { return temperature; }
    public Double getHumidity() { return humidity; }
    public Double getPh() { return ph; }
    public Double getRainfall() { return rainfall; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setRecommendedCrop(String recommendedCrop) {
        this.recommendedCrop = recommendedCrop;
    }
    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }
    public void setNitrogen(Double nitrogen) { this.nitrogen = nitrogen; }
    public void setPhosphorus(Double phosphorus) {
        this.phosphorus = phosphorus;
    }
    public void setPotassium(Double potassium) {
        this.potassium = potassium;
    }
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    public void setHumidity(Double humidity) { this.humidity = humidity; }
    public void setPh(Double ph) { this.ph = ph; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}