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
@Table(name = "market_prices")
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crop_name")
    private String cropName;

    @Column(name = "crop_name_tamil")
    private String cropNameTamil;

    private Double price;

    @Column(name = "previous_price")
    private Double previousPrice;

    private String unit;
    private String market;
    private String state;

    @Column(name = "price_date")
    private LocalDate priceDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.priceDate == null) {
            this.priceDate = LocalDate.now();
        }
    }

    // ============ GETTERS ============
    public Long getId() { return id; }
    public String getCropName() { return cropName; }
    public String getCropNameTamil() { return cropNameTamil; }
    public Double getPrice() { return price; }
    public Double getPreviousPrice() { return previousPrice; }
    public String getUnit() { return unit; }
    public String getMarket() { return market; }
    public String getState() { return state; }
    public LocalDate getPriceDate() { return priceDate; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setCropName(String cropName) { this.cropName = cropName; }
    public void setCropNameTamil(String cropNameTamil) {
        this.cropNameTamil = cropNameTamil;
    }
    public void setPrice(Double price) { this.price = price; }
    public void setPreviousPrice(Double previousPrice) {
        this.previousPrice = previousPrice;
    }
    public void setUnit(String unit) { this.unit = unit; }
    public void setMarket(String market) { this.market = market; }
    public void setState(String state) { this.state = state; }
    public void setPriceDate(LocalDate priceDate) {
        this.priceDate = priceDate;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}