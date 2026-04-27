package com.agriculture.repository;
import com.agriculture.model.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {
    List<MarketPrice> findByCropNameContainingIgnoreCase(String crop);
    List<MarketPrice> findByState(String state);
}