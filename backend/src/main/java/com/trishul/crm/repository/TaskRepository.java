package com.trishul.crm.repository;

import com.trishul.crm.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    long countByStatus(String status);
    List<Task> findTop5ByOrderByCreatedAtDesc();
}
