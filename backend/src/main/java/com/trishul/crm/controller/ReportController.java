package com.trishul.crm.controller;

import com.trishul.crm.dto.ApiResponse;
import com.trishul.crm.entity.Report;
import com.trishul.crm.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Report>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Reports fetched", reportService.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Report>> create(@Valid @RequestBody Report report) {
        Report created = reportService.create(report);
        return ResponseEntity.status(201).body(ApiResponse.success("Report generated", created));
    }
}
