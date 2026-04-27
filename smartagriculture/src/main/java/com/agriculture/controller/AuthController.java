package com.agriculture.controller;
import com.agriculture.model.User;
import com.agriculture.repository.UserRepository;
import com.agriculture.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired UserRepository userRepo;
    @Autowired JwtUtil jwtUtil;
    @Autowired PasswordEncoder encoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepo.findByEmail(user.getEmail()).isPresent())
            return ResponseEntity.badRequest().body(Map.of("error","Email already exists"));
        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole("FARMER");
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message","Registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> body) {
        var user = userRepo.findByEmail(body.get("email"))
            .orElse(null);
        if (user == null || !encoder.matches(body.get("password"), user.getPassword()))
            return ResponseEntity.status(401).body(Map.of("error","Invalid credentials"));
        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of(
            "token", token,
            "name", user.getName(),
            "email", user.getEmail(),
            "location", user.getLocation() != null ? user.getLocation() : "Chennai"
        ));
    }
}