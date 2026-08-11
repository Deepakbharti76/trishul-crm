package com.trishul.crm.service;

import com.trishul.crm.entity.Report;
import com.trishul.crm.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    public List<Report> getAll() {
        return reportRepository.findAll();
    }

    @Transactional
    public Report create(Report report) {
        return reportRepository.save(report);
    }
}
