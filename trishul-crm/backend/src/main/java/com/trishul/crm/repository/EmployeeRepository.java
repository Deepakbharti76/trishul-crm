package com.trishul.crm.repository;

import com.trishul.crm.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    long countByStatus(String status);
}
