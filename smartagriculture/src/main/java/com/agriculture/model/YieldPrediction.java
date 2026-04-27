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
@Table(name = "yield_predictions")
public class YieldPrediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "crop_name")
    private String cropName;

    private Double area;
    private Double rainfall;
    private Double temperature;
    private Double fertilizer;

    @Column(name = "predicted_yield")
    private Double predictedYield;

    private String unit;
    private String season;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.unit == null) this.unit = "tons/hectare";
    }

    // ============ GETTERS ============
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getCropName() { return cropName; }
    public Double getArea() { return area; }
    public Double getRainfall() { return rainfall; }
    public Double getTemperature() { return temperature; }
    public Double getFertilizer() { return fertilizer; }
    public Double getPredictedYield() { return predictedYield; }
    public String getUnit() { return unit; }
    public String getSeason() { return season; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setCropName(String cropName) { this.cropName = cropName; }
    public void setArea(Double area) { this.area = area; }
    public void setRainfall(Double rainfall) { this.rainfall = rainfall; }
    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
    public void setFertilizer(Double fertilizer) {
        this.fertilizer = fertilizer;
    }
    public void setPredictedYield(Double predictedYield) {
        this.predictedYield = predictedYield;
    }
    public void setUnit(String unit) { this.unit = unit; }
    public void setSeason(String season) { this.season = season; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}