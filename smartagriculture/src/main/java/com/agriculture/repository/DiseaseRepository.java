package com.agriculture.repository;
import com.agriculture.model.Disease;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    List<Disease> findByUserIdOrderByDetectedAtDesc(Long userId);
}