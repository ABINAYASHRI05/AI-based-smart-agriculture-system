package com.agriculture.controller;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {
    @Value("${weather.api.key}") private String apiKey;
    @Value("${weather.api.url}") private String apiUrl;
    private final RestTemplate rest = new RestTemplate();

    @GetMapping
    public ResponseEntity<?> getWeather(@RequestParam String city) {
        try {
            String url = apiUrl + "?q=" + city + "&appid=" + apiKey + "&units=metric";
            Map result = rest.getForObject(url, Map.class);
            Map main = (Map) result.get("main");
            Map weather = (Map)((java.util.List)result.get("weather")).get(0);
            return ResponseEntity.ok(Map.of(
                "city", city,
                "temperature", main.get("temp"),
                "humidity", main.get("humidity"),
                "description", weather.get("description"),
                "feelsLike", main.get("feels_like")
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}