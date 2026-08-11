package com.trishul.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Employee name is required")
    @Pattern(regexp = "^[A-Za-z][A-Za-z .'-]*$", message = "Name must contain only letters")
    @Column(nullable = false, length = 100)
    private String name;

    @Email(message = "Email must be valid")
    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String designation;

    @Column(length = 100)
    private String department;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Builder.Default
    @Column(precision = 12, scale = 2)
    private BigDecimal salary = BigDecimal.ZERO;

    @Builder.Default
    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, ON_LEAVE

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
