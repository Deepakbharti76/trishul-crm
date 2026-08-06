package com.trishul.crm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Setting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "company_name", length = 100)
    private String companyName;

    @Column(name = "company_email", length = 100)
    private String companyEmail;

    @Column(name = "currency", length = 10)
    private String currency;

    @Column(name = "timezone", length = 50)
    private String timezone;

    @Column(name = "theme", length = 20)
    private String theme;

    @Column(name = "email_notifications")
    private boolean emailNotifications;

    @Column(name = "sms_notifications")
    private boolean smsNotifications;

    @Column(name = "fiscal_year_start", length = 20)
    private String fiscalYearStart;
}
