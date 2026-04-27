package com.agriculture.controller;
import com.agriculture.model.Subsidy;
import com.agriculture.repository.SubsidyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/subsidies")
public class SubsidyController {
    @Autowired SubsidyRepository repo;

    @GetMapping
    public ResponseEntity<List<Subsidy>> getAll(@RequestParam(required=false) String state) {
        if (state != null)
            return ResponseEntity.ok(repo.findByStateAndIsActive(state, true));
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Subsidy>> getByCategory(@PathVariable String category) {
        return ResponseEntity.ok(repo.findByCategoryAndIsActive(category, true));
    }
}