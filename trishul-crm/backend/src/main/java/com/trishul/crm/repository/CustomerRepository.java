package com.trishul.crm.repository;

import com.trishul.crm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    long countByStatus(String status);
}
