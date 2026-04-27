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
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "name_tamil")
    private String nameTamil;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(columnDefinition = "VARCHAR(100) DEFAULT 'Chennai'")
    private String location;

    @Column(name = "soil_type",
            columnDefinition = "VARCHAR(50) DEFAULT 'Clay Loam'")
    private String soilType;

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'FARMER'")
    private String role;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        if (this.role == null) this.role = "FARMER";
        if (this.location == null) this.location = "Chennai";
    }

    // ============ GETTERS ============
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getNameTamil() { return nameTamil; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
    public String getPhone() { return phone; }
    public String getLocation() { return location; }
    public String getSoilType() { return soilType; }
    public String getRole() { return role; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ============ SETTERS ============
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setNameTamil(String nameTamil) { this.nameTamil = nameTamil; }
    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setLocation(String location) { this.location = location; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
    public void setRole(String role) { this.role = role; }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}