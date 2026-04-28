# 🌾 AI-Based Smart Agriculture System

<div align="center">

![Tamil Nadu Farmers](https://img.shields.io/badge/For-Tamil%20Nadu%20Farmers-green?style=for-the-badge&logo=leaf)
![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Python](https://img.shields.io/badge/Python-3.x-yellow?style=for-the-badge&logo=python)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)

**AI-powered full-stack web application helping Tamil Nadu farmers with crop recommendations, disease detection, market prices, and government subsidies.**

[🌐 Live Demo](#live-demo) • [✨ Features](#features) • [🛠️ Tech Stack](#tech-stack) • [🚀 Run Locally](#run-locally) • [👩‍💻 Developer](#developer)

</div>

---


## 📸 Screenshots

> Add your screenshots here after deployment

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌱 **Crop Recommendation** | AI suggests best crop using soil + weather data (95% accuracy) |
| 🔬 **Disease Detection** | Upload crop photo → AI identifies disease + Tamil treatment guide |
| 🛰️ **Satellite Farm Analysis** | NASA POWER API auto-fetches soil NDVI and health data |
| 📈 **Live Market Prices** | Real-time Tamil Nadu mandi prices from Agmarknet API |
| 🏛️ **Government Subsidies** | PM-KISAN, seed subsidy, crop insurance info in Tamil + English |
| 🗣️ **Voice Guide** | Tamil voice walkthrough for non-literate farmers |
| 📅 **Farming Calendar** | Month-wise organic farming schedule for Kharif, Rabi, Summer |
| 🌿 **Organic Tips** | 9 organic farming techniques with Tamil explanations |
| 🔐 **Forgot Password** | OTP-based password reset via Gmail |
| 📧 **Email Notifications** | Welcome email on register, login alert, daily weather alerts |
| 🌐 **Bilingual UI** | Complete Tamil + English language switching |
| 🔒 **JWT Security** | Secure authentication with Spring Security + JWT tokens |

---

## 🛠️ Tech Stack

### Backend — Spring Boot
```
Java 17 + Spring Boot 3.x
Spring Security + JWT Authentication
REST APIs + JPA/Hibernate
MySQL 8.0
Gmail SMTP (Email Notifications)
BCrypt Password Encoding
OTP-based Password Reset
```

### Frontend — React.js
```
React.js 18 + React Router DOM
Chart.js — Market price graphs
Web Speech API — Voice input + voice guide
Axios — API calls
Bilingual Tamil + English UI
Context API — Language state management
```

### AI/ML — Python Flask
```
Random Forest — Crop recommendation (95%+ accuracy)
CNN — Disease detection from crop photos
Scikit-learn + TensorFlow
Flask REST API with CORS
Trained on PlantVillage + Kaggle datasets
```

### External APIs
```
OpenWeatherMap — Live weather data
NASA POWER API — Satellite soil data
Open-Meteo — Additional weather data
Agmarknet (data.gov.in) — Tamil Nadu mandi prices
```

---

## 🚀 Run Locally

### Prerequisites
```
Java 17+
Node.js 18+
Python 3.8+
MySQL 8.0
Maven
```

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ABINAYASHRI05/AI-based-smart-agriculture-system.git
cd AI-based-smart-agriculture-system
```

### 2️⃣ Setup MySQL Database
```sql
CREATE DATABASE smart_agriculture;
```

### 3️⃣ Configure Spring Boot
```bash
cd smartagriculture/src/main/resources
cp application.properties.example application.properties
# Open application.properties and fill in your values:
# - MySQL password
# - OpenWeatherMap API key
# - Gmail + App password
# - JWT secret
```

### 4️⃣ Start Python ML Service
```bash
cd ml_service
pip install flask scikit-learn pandas numpy joblib pillow flask-cors
python train_model.py     # Generate .pkl model files
python app.py             # Starts on http://localhost:5000
```

Test ML service:
```
http://localhost:5000/health
```

### 5️⃣ Start Spring Boot Backend
```bash
cd smartagriculture
mvn spring-boot:run
# Starts on http://localhost:8080
```

Test backend:
```
http://localhost:8080/api/subsidies
```

### 6️⃣ Start React Frontend
```bash
cd agri-frontend
npm install
npm start
# Opens on http://localhost:3000
```

---

## 📁 Project Structure

```
AI-based-smart-agriculture-system/
│
├── agri-frontend/                    # React.js Frontend
│   └── src/
│       ├── pages/
│       │   ├── Dashboard.js          # Main dashboard
│       │   ├── CropRecommend.js      # AI crop recommendation
│       │   ├── DiseaseDetect.js      # Disease detection
│       │   ├── MarketPrices.js       # Live market prices
│       │   ├── Subsidies.js          # Government schemes
│       │   ├── SatelliteFarm.js      # Satellite analysis
│       │   ├── Login.js              # Authentication
│       │   ├── Register.js           # Registration
│       │   ├── ForgotPassword.js     # OTP password reset
│       │   └── AboutUs.js            # About page
│       ├── components/
│       │   ├── Navbar.js             # Navigation with dropdown
│       │   └── VoiceGuide.js         # Tamil voice guide
│       ├── context/
│       │   └── LanguageContext.js    # Tamil/English toggle
│       └── api/
│           └── axios.js              # API configuration
│
├── smartagriculture/                 # Spring Boot Backend
│   └── src/main/java/com/agriculture/
│       ├── controller/               # REST API endpoints
│       │   ├── AuthController.java   # Login, Register
│       │   ├── CropController.java   # Crop recommendation
│       │   ├── DiseaseController.java
│       │   ├── WeatherController.java
│       │   ├── MarketPriceController.java
│       │   ├── SubsidyController.java
│       │   ├── SatelliteController.java
│       │   └── AlertController.java
│       ├── service/                  # Business logic
│       │   ├── NotificationService.java  # Email alerts
│       │   ├── AlertScheduler.java       # Scheduled alerts
│       │   ├── PasswordResetService.java # OTP reset
│       │   ├── WeatherService.java
│       │   ├── SatelliteService.java
│       │   └── FarmingCalendarService.java
│       ├── model/                    # Database entities
│       ├── repository/               # JPA repositories
│       ├── security/                 # JWT auth
│       │   ├── JwtUtil.java
│       │   └── JwtFilter.java
│       └── config/
│           └── SecurityConfig.java
│
├── ml_service/                       # Python ML Service
│   ├── app.py                        # Flask API server
│   ├── train_model.py                # Model training
│   ├── crop_model.pkl                # Trained Random Forest
│   ├── label_encoder.pkl             # Label encoder
│   └── yield_model.pkl               # Yield prediction model
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new farmer |
| POST | `/api/auth/login` | Login + get JWT token |
| POST | `/api/auth/forgot-password` | Send OTP to email |
| POST | `/api/auth/verify-otp` | Verify OTP |
| POST | `/api/auth/reset-password` | Reset password |

### Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/crop/recommend` | Get crop recommendation |
| POST | `/api/disease/detect` | Detect crop disease |
| GET | `/api/weather` | Get live weather |
| GET | `/api/market-prices` | Get market prices |
| GET | `/api/subsidies` | Get government subsidies |
| GET | `/api/satellite/farming-calendar` | Get farming calendar |
| GET | `/api/alerts/user/{id}` | Get user alerts |

---

## 🔐 Environment Variables

Create `application.properties` from the example file:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/smart_agriculture
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# JWT
jwt.secret=YOUR_JWT_SECRET

# ML Service
ml.service.url=http://localhost:5000

# Weather API (openweathermap.org)
weather.api.key=YOUR_OPENWEATHERMAP_KEY

# Gmail SMTP
spring.mail.username=YOUR_GMAIL
spring.mail.password=YOUR_16_CHAR_APP_PASSWORD
```

> ⚠️ Never commit `application.properties` — it is in `.gitignore`

---

## 📊 ML Models

| Model | Algorithm | Accuracy | Dataset |
|-------|-----------|----------|---------|
| Crop Recommendation | Random Forest | 95%+ | Kaggle Crop Dataset |
| Disease Detection | CNN (TensorFlow) | 90%+ | PlantVillage Dataset |
| Yield Prediction | Linear Regression | — | Generated Data |

---

## 📧 Notification System (Free — No Twilio)

```
Register  → Welcome email with all service details
Login     → Login alert email for security
Daily 7AM → Weather alert email to all farmers
Weekly    → Market price summary alert in DB
Monthly   → Subsidy reminder alert in DB
Forgot PW → 6-digit OTP sent to Gmail
```

---

## 🌐 Deployment

| Service | Platform | Cost |
|---------|----------|------|
| React Frontend | Vercel | Free |
| Spring Boot API | Render | Free |
| Python ML | Render | Free |
| MySQL Database | Railway | Free |

---

## 👩‍💻 Developer

<div align="center">

**Abinaya Shri P**

MCA Graduate — Vivekananda College (Autonomous), Chennai

[![Email](https://img.shields.io/badge/Email-abinayashri0506@gmail.com-red?style=flat&logo=gmail)](mailto:abinayashri0506@gmail.com)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-abinayashri--p-blue?style=flat&logo=linkedin)](https://linkedin.com/in/abinayashri-p-5ab4b9290)
[![GitHub](https://img.shields.io/badge/GitHub-ABINAYASHRI05-black?style=flat&logo=github)](https://github.com/ABINAYASHRI05)

</div>

---

## 📄 License

This project is open source for educational purposes.

---

<div align="center">
Made with ❤️ for Tamil Nadu Farmers 🌾
</div>
