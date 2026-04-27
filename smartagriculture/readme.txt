# 🌾 AI Smart Agriculture System — Backend

Spring Boot backend for AI-powered Smart Agriculture System
helping Tamil Nadu farmers with crop recommendations,
disease detection, market prices and government subsidies.

## Tech Stack
- Java 17 + Spring Boot 3.x
- Spring Security + JWT Authentication
- MySQL 8.0 + JPA/Hibernate
- REST APIs + OpenWeatherMap + NASA POWER
- Twilio WhatsApp Alerts

## Setup

### 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/smart-agriculture-backend.git

### 2. Create database
CREATE DATABASE smart_agriculture;

### 3. Configure properties
cp src/main/resources/application.properties.example
   src/main/resources/application.properties
# Fill in your values

### 4. Run
mvn spring-boot:run
# Starts on http://localhost:8080

## API Endpoints
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register farmer |
| POST | /api/auth/login | Login + get token |
| POST | /api/crop/recommend | Get crop recommendation |
| POST | /api/disease/detect | Detect crop disease |
| GET  | /api/weather | Get weather data |
| GET  | /api/market-prices | Get market prices |
| GET  | /api/subsidies | Get government subsidies |
| GET  | /api/satellite/farming-calendar | Get farming calendar |

## Developer
Abinaya Shri P — MCA Graduate
abinayashri0506@gmail.com