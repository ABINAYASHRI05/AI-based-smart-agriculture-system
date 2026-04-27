package com.agriculture.controller;
import com.agriculture.model.Crop;
import com.agriculture.repository.CropRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/crop")
public class CropController {
    @Autowired CropRepository cropRepo;
    @Value("${ml.service.url}") private String mlUrl;
    private final RestTemplate rest = new RestTemplate();

    @PostMapping("/recommend")
    public ResponseEntity<?> recommend(@RequestBody Map<String,Object> body) {
        try {
            Object result = rest.postForObject(mlUrl + "/predict/crop", body, Object.class);
            Crop crop = new Crop();
            crop.setNitrogen(Double.valueOf(body.get("nitrogen").toString()));
            crop.setPhosphorus(Double.valueOf(body.get("phosphorus").toString()));
            crop.setPotassium(Double.valueOf(body.get("potassium").toString()));
            crop.setTemperature(Double.valueOf(body.get("temperature").toString()));
            crop.setHumidity(Double.valueOf(body.get("humidity").toString()));
            crop.setPh(Double.valueOf(body.get("ph").toString()));
            crop.setRainfall(Double.valueOf(body.get("rainfall").toString()));
            cropRepo.save(crop);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> history(@PathVariable Long userId) {
        return ResponseEntity.ok(cropRepo.findByUserIdOrderByCreatedAtDesc(userId));
    }
}