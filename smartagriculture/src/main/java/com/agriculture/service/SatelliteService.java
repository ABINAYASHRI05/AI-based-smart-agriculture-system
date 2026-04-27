package com.agriculture.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.time.LocalDate;
import java.util.*;

@Service
public class SatelliteService {

    private final RestTemplate rest = new RestTemplate();

    public Map<String, Object> getSatelliteData(
            double latitude, double longitude) {

        Map<String, Object> result = new HashMap<>();
        result.put("latitude", latitude);
        result.put("longitude", longitude);

        // Step 1: Open-Meteo free satellite weather + soil
        try {
            String url = "https://api.open-meteo.com/v1/forecast"
                + "?latitude=" + latitude
                + "&longitude=" + longitude
                + "&hourly=soil_moisture_0_1cm,"
                + "soil_temperature_0cm,"
                + "precipitation"
                + "&current_weather=true"
                + "&timezone=Asia%2FKolkata"
                + "&forecast_days=1";

            Map data = rest.getForObject(url, Map.class);
            if (data != null) {
                Map cw = (Map) data.get("current_weather");
                if (cw != null) {
                    double temp = Double.parseDouble(
                        cw.get("temperature").toString());
                    double wind = Double.parseDouble(
                        cw.get("windspeed").toString());
                    result.put("temperature", Math.round(temp));
                    result.put("windspeed", Math.round(wind));
                }

                // Get first hourly soil moisture value
                Map hourly = (Map) data.get("hourly");
                if (hourly != null) {
                    List sm = (List) hourly.get(
                        "soil_moisture_0_1cm");
                    List st = (List) hourly.get(
                        "soil_temperature_0cm");
                    List pr = (List) hourly.get(
                        "precipitation");

                    if (sm != null && !sm.isEmpty()
                            && sm.get(0) != null) {
                        double moisture = Double.parseDouble(
                            sm.get(0).toString());
                        result.put("soilMoisture",
                            Math.round(moisture * 100.0)
                            / 100.0);
                    }
                    if (st != null && !st.isEmpty()
                            && st.get(0) != null) {
                        result.put("soilTemperature",
                            Math.round(Double.parseDouble(
                                st.get(0).toString())));
                    }
                    if (pr != null && !pr.isEmpty()
                            && pr.get(0) != null) {
                        result.put("precipitation",
                            pr.get(0));
                    }
                }
            }
        } catch (Exception e) {
            result.put("weatherError", e.getMessage());
            // Default values if API fails
            result.put("temperature", 32);
            result.put("soilMoisture", 0.28);
        }

        // Step 2: Calculate NDVI from season + location
        double ndvi = calculateNDVI(latitude, longitude);
        result.put("ndvi", ndvi);
        result.put("ndviPercent",
            Math.round(ndvi * 100));
        result.put("soilHealth",
            getSoilHealth(ndvi));
        result.put("soilHealthTamil",
            getSoilHealthTamil(ndvi));
        result.put("cropGrowthStage",
            getCropGrowthStage(ndvi));
        result.put("cropGrowthStageTamil",
            getCropGrowthStageTamil(ndvi));

        // Step 3: Soil nutrients estimated from location
        Map<String, Object> nutrients =
            estimateSoilNutrients(latitude, longitude);
        result.put("nutrients", nutrients);

        // Step 4: Satellite-based crop recommendation
        result.put("satelliteRecommendation",
            getRecommendation(ndvi, nutrients));

        return result;
    }

    private double calculateNDVI(
            double lat, double lon) {
        int month = LocalDate.now().getMonthValue();
        double base = 0.45;
        // Tamil Nadu seasonal NDVI patterns
        if (month >= 6 && month <= 9)  base = 0.62;
        if (month >= 10 && month <= 11) base = 0.58;
        if (month >= 12 || month <= 2)  base = 0.52;
        if (month >= 3 && month <= 5)   base = 0.35;
        // Delta region boost (Thanjavur/Trichy lat)
        if (lat >= 10.0 && lat <= 11.5) base += 0.08;
        return Math.round(base * 100.0) / 100.0;
    }

    private String getSoilHealth(double ndvi) {
        if (ndvi >= 0.6) return "EXCELLENT";
        if (ndvi >= 0.4) return "GOOD";
        if (ndvi >= 0.2) return "MODERATE";
        return "POOR";
    }

    private String getSoilHealthTamil(double ndvi) {
        if (ndvi >= 0.6) return "மிகவும் நல்லது";
        if (ndvi >= 0.4) return "நல்லது";
        if (ndvi >= 0.2) return "சாதாரணம்";
        return "மோசம் — கவனிக்கவும்";
    }

    private String getCropGrowthStage(double ndvi) {
        if (ndvi >= 0.6) return "Peak vegetation";
        if (ndvi >= 0.4) return "Active growth";
        if (ndvi >= 0.2) return "Early growth";
        return "Bare soil — Ready for sowing";
    }

    private String getCropGrowthStageTamil(double ndvi) {
        if (ndvi >= 0.6) return "செழிப்பான வளர்ச்சி";
        if (ndvi >= 0.4) return "சுறுசுறுப்பான வளர்ச்சி";
        if (ndvi >= 0.2) return "ஆரம்ப வளர்ச்சி";
        return "வெற்று மண் — விதைக்கலாம்";
    }

    private Map<String, Object> estimateSoilNutrients(
            double lat, double lon) {
        Map<String, Object> n = new HashMap<>();
        // Tamil Nadu soil nutrient estimates by region
        // Delta (lat 10-11.5): Rich alluvial soil
        if (lat >= 10.0 && lat <= 11.5) {
            n.put("nitrogen", 95);
            n.put("phosphorus", 55);
            n.put("potassium", 58);
            n.put("ph", 6.2);
            n.put("soilType", "Alluvial — வண்டல் மண்");
        }
        // Western (lat 11-11.5, lon 76-77): Red soil
        else if (lon >= 76.0 && lon <= 77.5) {
            n.put("nitrogen", 78);
            n.put("phosphorus", 35);
            n.put("potassium", 42);
            n.put("ph", 7.2);
            n.put("soilType", "Red Soil — செம்மண்");
        }
        // Coastal (lon > 79.5): Sandy soil
        else if (lon >= 79.5) {
            n.put("nitrogen", 72);
            n.put("phosphorus", 30);
            n.put("potassium", 38);
            n.put("ph", 7.5);
            n.put("soilType", "Sandy — மணல் மண்");
        }
        // Default: Clay loam
        else {
            n.put("nitrogen", 87);
            n.put("phosphorus", 42);
            n.put("potassium", 47);
            n.put("ph", 6.7);
            n.put("soilType", "Clay Loam — களிமண்");
        }
        return n;
    }

    private String getRecommendation(
            double ndvi,
            Map<String, Object> nutrients) {
        int nitrogen = Integer.parseInt(
            nutrients.get("nitrogen").toString());
        double ph = Double.parseDouble(
            nutrients.get("ph").toString());
        int month = LocalDate.now().getMonthValue();

        if (month >= 6 && month <= 9) {
            if (nitrogen > 85) return "நெல் — Rice";
            if (ph > 7.0) return "கோதுமை — Wheat";
            return "சோளம் — Maize";
        }
        if (month >= 10 && month <= 11) {
            return "நெல் / கரும்பு — Rice / Sugarcane";
        }
        if (month >= 12 || month <= 3) {
            if (ph < 7.0) return "கடலை — Groundnut";
            return "சூரியகாந்தி — Sunflower";
        }
        return "பச்சை பயிறு — Green Gram";
    }
}