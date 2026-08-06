package com.trishul.crm.controller;

import com.trishul.crm.dto.ApiResponse;
import com.trishul.crm.entity.Task;
import com.trishul.crm.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Tasks fetched", taskService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Task fetched", taskService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> create(@Valid @RequestBody Task task) {
        Task created = taskService.create(task);
        return ResponseEntity.status(201).body(ApiResponse.success("Task created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Task>> update(@PathVariable Long id, @Valid @RequestBody Task task) {
        return ResponseEntity.ok(ApiResponse.success("Task updated", taskService.update(id, task)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }
}
