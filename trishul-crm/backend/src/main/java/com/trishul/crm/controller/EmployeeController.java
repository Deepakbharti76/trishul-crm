package com.trishul.crm.controller;

import com.trishul.crm.dto.ApiResponse;
import com.trishul.crm.entity.Employee;
import com.trishul.crm.service.EmployeeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Employee>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Employees fetched", employeeService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Employee fetched", employeeService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Employee>> create(@Valid @RequestBody Employee employee) {
        Employee created = employeeService.create(employee);
        return ResponseEntity.status(201).body(ApiResponse.success("Employee created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Employee>> update(@PathVariable Long id, @Valid @RequestBody Employee employee) {
        return ResponseEntity.ok(ApiResponse.success("Employee updated", employeeService.update(id, employee)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        employeeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Employee deleted", null));
    }
}
