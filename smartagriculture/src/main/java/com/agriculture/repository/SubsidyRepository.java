package com.agriculture.repository;
import com.agriculture.model.Subsidy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface SubsidyRepository extends JpaRepository<Subsidy, Long> {
    List<Subsidy> findByStateAndIsActive(String state, Boolean isActive);
    List<Subsidy> findByCategoryAndIsActive(String category, Boolean isActive);
}