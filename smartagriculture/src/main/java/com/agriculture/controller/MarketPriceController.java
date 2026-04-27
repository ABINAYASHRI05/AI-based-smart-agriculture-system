package com.agriculture.controller;
import com.agriculture.model.MarketPrice;
import com.agriculture.repository.MarketPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/market-prices")
public class MarketPriceController {
    @Autowired MarketPriceRepository repo;

    @GetMapping
    public ResponseEntity<List<MarketPrice>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<List<MarketPrice>> getByState(@PathVariable String state) {
        return ResponseEntity.ok(repo.findByState(state));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MarketPrice>> search(@RequestParam String crop) {
        return ResponseEntity.ok(repo.findByCropNameContainingIgnoreCase(crop));
    }

    @PostMapping
    public ResponseEntity<MarketPrice> add(@RequestBody MarketPrice price) {
        return ResponseEntity.ok(repo.save(price));
    }
}