package com.agriculture.controller;
import com.agriculture.model.Disease;
import com.agriculture.repository.DiseaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import java.util.*;
import java.util.Base64;

@RestController
@RequestMapping("/api/disease")
public class DiseaseController {
    @Autowired DiseaseRepository diseaseRepo;
    @Value("${ml.service.url}") private String mlUrl;
    private final RestTemplate rest = new RestTemplate();

    @PostMapping("/detect")
    public ResponseEntity<?> detect(@RequestParam("image") MultipartFile file) {
        try {
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            Map<String,String> payload = Map.of("image", base64);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String,String>> entity = new HttpEntity<>(payload, headers);
            Object result = rest.postForObject(mlUrl + "/predict/disease", entity, Object.class);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }
}