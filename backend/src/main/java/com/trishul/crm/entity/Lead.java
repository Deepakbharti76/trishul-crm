package com.trishul.crm.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Lead name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 50)
    private String source; // WEBSITE, REFERRAL, SOCIAL_MEDIA, COLD_CALL, ADVERTISEMENT

    @Builder.Default
    @Column(length = 30)
    private String status = "NEW"; // NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST

    @Builder.Default
    @Column(precision = 12, scale = 2)
    private BigDecimal value = BigDecimal.ZERO;

    @Column(name = "assigned_to", length = 100)
    private String assignedTo;

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
