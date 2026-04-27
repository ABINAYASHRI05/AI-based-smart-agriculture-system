package com.agriculture.repository;
import com.agriculture.model.Crop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CropRepository extends JpaRepository<Crop, Long> {
    List<Crop> findByUserIdOrderByCreatedAtDesc(Long userId);
}