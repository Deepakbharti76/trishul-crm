package com.trishul.crm.controller;

import com.trishul.crm.dto.ApiResponse;
import com.trishul.crm.entity.Lead;
import com.trishul.crm.service.LeadService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/leads")
@RequiredArgsConstructor
public class LeadController {

    private final LeadService leadService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Lead>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Leads fetched", leadService.getAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Lead fetched", leadService.getById(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Lead>> create(@Valid @RequestBody Lead lead) {
        Lead created = leadService.create(lead);
        return ResponseEntity.status(201).body(ApiResponse.success("Lead created", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Lead>> update(@PathVariable Long id, @Valid @RequestBody Lead lead) {
        return ResponseEntity.ok(ApiResponse.success("Lead updated", leadService.update(id, lead)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> delete(@PathVariable Long id) {
        leadService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Lead deleted", null));
    }
}
