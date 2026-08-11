package com.trishul.crm.repository;

import com.trishul.crm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LeadRepository extends JpaRepository<Lead, Long> {
    long countByStatus(String status);
    List<Lead> findTop5ByOrderByCreatedAtDesc();
}
