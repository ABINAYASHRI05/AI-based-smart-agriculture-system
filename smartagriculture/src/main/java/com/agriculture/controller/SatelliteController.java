package com.agriculture.controller;

import com.agriculture.service.SatelliteService;
import com.agriculture.service.FarmingCalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/satellite")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://localhost:3001"
})
public class SatelliteController {

    @Autowired
    private SatelliteService satelliteService;

    @Autowired
    private FarmingCalendarService calendarService;

    @GetMapping("/soil-data")
    public ResponseEntity<?> getSoilData(
            @RequestParam(defaultValue="13.0827")
            double lat,
            @RequestParam(defaultValue="80.2707")
            double lon) {
        try {
            Map<String, Object> data =
                satelliteService.getSatelliteData(
                    lat, lon);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/farming-calendar")
    public ResponseEntity<?> getFarmingCalendar(
            @RequestParam(defaultValue="Chennai")
            String location,
            @RequestParam(defaultValue="Clay Loam")
            String soilType) {
        try {
            Map<String, Object> calendar =
                calendarService.getYearlyCalendar(
                    location, soilType);
            return ResponseEntity.ok(calendar);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/recommend-on-register")
    public ResponseEntity<?> recommendOnRegister(
            @RequestBody Map<String, Object> body) {
        try {
            String location = body.getOrDefault(
                "location", "Chennai").toString();
            String soilType = body.getOrDefault(
                "soilType", "Clay Loam").toString();
            double lat = Double.parseDouble(
                body.getOrDefault(
                    "latitude", "13.0827").toString());
            double lon = Double.parseDouble(
                body.getOrDefault(
                    "longitude", "80.2707").toString());

            Map<String, Object> satellite =
                satelliteService.getSatelliteData(
                    lat, lon);
            Map<String, Object> calendar =
                calendarService.getYearlyCalendar(
                    location, soilType);

            return ResponseEntity.ok(Map.of(
                "satellite",   satellite,
                "calendar",    calendar,
                "message",     "உங்கள் நிலத்தின் செயற்கைக்கோள் தரவு தயார்!",
                "messageTamil","Your farm satellite data is ready!",
                "location",    location,
                "soilType",    soilType
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", e.getMessage()));
        }
    }
}