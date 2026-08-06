package com.trishul.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsDTO {
    private long totalCustomers;
    private long totalLeads;
    private long pendingTasks;
    private long totalEmployees;
    private BigDecimal totalRevenue;
    private Map<String, Long> leadsByStatus;
    private Map<String, Long> tasksByStatus;
    private List<Map<String, Object>> recentActivity;
    private List<Map<String, Object>> monthlyRevenue;
}
