package com.trishul.crm.service;

import com.trishul.crm.dto.DashboardStatsDTO;
import com.trishul.crm.entity.Lead;
import com.trishul.crm.entity.Task;
import com.trishul.crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;

    public DashboardStatsDTO getStats() {
        List<Lead> allLeads = leadRepository.findAll();
        List<Task> allTasks = taskRepository.findAll();

        BigDecimal totalRevenue = allLeads.stream()
                .filter(l -> "WON".equalsIgnoreCase(l.getStatus()))
                .map(Lead::getValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long pendingTasks = allTasks.stream()
                .filter(t -> "PENDING".equalsIgnoreCase(t.getStatus()) || "IN_PROGRESS".equalsIgnoreCase(t.getStatus()))
                .count();

        Map<String, Long> leadsByStatus = allLeads.stream()
                .collect(Collectors.groupingBy(Lead::getStatus, LinkedHashMap::new, Collectors.counting()));

        Map<String, Long> tasksByStatus = allTasks.stream()
                .collect(Collectors.groupingBy(Task::getStatus, LinkedHashMap::new, Collectors.counting()));

        List<Map<String, Object>> recentActivity = new ArrayList<>();
        leadRepository.findTop5ByOrderByCreatedAtDesc().forEach(l -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("type", "LEAD");
            item.put("title", "New lead: " + l.getName());
            item.put("status", l.getStatus());
            item.put("timestamp", l.getCreatedAt());
            recentActivity.add(item);
        });
        taskRepository.findTop5ByOrderByCreatedAtDesc().forEach(t -> {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("type", "TASK");
            item.put("title", "Task: " + t.getTitle());
            item.put("status", t.getStatus());
            item.put("timestamp", t.getCreatedAt());
            recentActivity.add(item);
        });
        recentActivity.sort((a, b) -> {
            Comparable ta = (Comparable) a.get("timestamp");
            Comparable tb = (Comparable) b.get("timestamp");
            if (ta == null || tb == null) return 0;
            return tb.compareTo(ta);
        });

        // Simple simulated monthly revenue trend built from won leads for the chart
        List<Map<String, Object>> monthlyRevenue = buildMonthlyRevenue(allLeads);

        return DashboardStatsDTO.builder()
                .totalCustomers(customerRepository.count())
                .totalLeads(leadRepository.count())
                .pendingTasks(pendingTasks)
                .totalEmployees(employeeRepository.count())
                .totalRevenue(totalRevenue)
                .leadsByStatus(leadsByStatus)
                .tasksByStatus(tasksByStatus)
                .recentActivity(recentActivity.size() > 6 ? recentActivity.subList(0, 6) : recentActivity)
                .monthlyRevenue(monthlyRevenue)
                .build();
    }

    private List<Map<String, Object>> buildMonthlyRevenue(List<Lead> leads) {
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"};
        BigDecimal wonTotal = leads.stream()
                .filter(l -> "WON".equalsIgnoreCase(l.getStatus()))
                .map(Lead::getValue).filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> result = new ArrayList<>();
        double base = wonTotal.doubleValue() > 0 ? wonTotal.doubleValue() / 4 : 120000;
        double[] weights = {0.6, 0.75, 0.65, 0.9, 0.85, 1.1, 1.3};
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("month", months[i]);
            item.put("revenue", Math.round(base * weights[i]));
            result.add(item);
        }
        return result;
    }
}
