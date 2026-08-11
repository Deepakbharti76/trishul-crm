package com.trishul.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Report title is required")
    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 50)
    private String type; // SALES, CUSTOMER, LEAD, EMPLOYEE, REVENUE

    @Lob
    @Column(name = "summary")
    private String summary;

    @Column(name = "generated_by", length = 100)
    private String generatedBy;

    @Column(name = "generated_date")
    private LocalDateTime generatedDate;

    @PrePersist
    protected void onCreate() {
        this.generatedDate = LocalDateTime.now();
    }
}
