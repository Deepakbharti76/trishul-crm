package com.trishul.crm.config;

import com.trishul.crm.entity.*;
import com.trishul.crm.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Seeds the database with roles, default users and sample business data
 * on first application start-up so the CRM is immediately usable.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final LeadRepository leadRepository;
    private final TaskRepository taskRepository;
    private final EmployeeRepository employeeRepository;
    private final ReportRepository reportRepository;
    private final SettingRepository settingRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        Role admin = seedRole("ROLE_ADMIN");
        Role supervisor = seedRole("ROLE_SUPERVISOR");
        Role user = seedRole("ROLE_USER");

        if (userRepository.count() == 0) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("Admin@123"))
                    .email("admin@trishulcrm.com")
                    .fullName("Deepak Kushwaha")
                    .role(admin)
                    .enabled(true)
                    .build());

            userRepository.save(User.builder()
                    .username("supervisor")
                    .password(passwordEncoder.encode("Super@123"))
                    .email("supervisor@trishulcrm.com")
                    .fullName("Guddu")
                    .role(supervisor)
                    .enabled(true)
                    .build());

            userRepository.save(User.builder()
                    .username("user")
                    .password(passwordEncoder.encode("User@123"))
                    .email("user@trishulcrm.com")
                    .fullName("Bablu")
                    .role(user)
                    .enabled(true)
                    .build());
        }

        if (customerRepository.count() == 0) {
            customerRepository.save(Customer.builder().name("Vikram Industries").email("contact@vikramind.com").phone("9876500001").company("Vikram Industries Pvt Ltd").address("Jaipur, Rajasthan").status("ACTIVE").build());
            customerRepository.save(Customer.builder().name("Meera Textiles").email("info@meeratextiles.com").phone("9876500002").company("Meera Textiles").address("Surat, Gujarat").status("ACTIVE").build());
            customerRepository.save(Customer.builder().name("Kiran Foods").email("hello@kiranfoods.com").phone("9876500003").company("Kiran Foods Ltd").address("Delhi, NCR").status("ACTIVE").build());
            customerRepository.save(Customer.builder().name("Suresh Motors").email("sales@sureshmotors.com").phone("9876500004").company("Suresh Motors").address("Pune, Maharashtra").status("INACTIVE").build());
            customerRepository.save(Customer.builder().name("Anjali Electronics").email("support@anjalielec.com").phone("9876500005").company("Anjali Electronics").address("Bengaluru, Karnataka").status("ACTIVE").build());
            customerRepository.save(Customer.builder().name("Devendra Realty").email("info@devendrarealty.com").phone("9876500006").company("Devendra Realty").address("Ahmedabad, Gujarat").status("ACTIVE").build());
        }

        if (leadRepository.count() == 0) {
    leadRepository.save(Lead.builder().name("Ramesh Agarwal").email("ramesh.a@example.com").phone("9123400001").source("WEBSITE").status("NEW").value(new BigDecimal("150000")).assignedTo("Deepak Kushwaha").build());

    leadRepository.save(Lead.builder().name("Sunita Rao").email("sunita.r@example.com").phone("9123400002").source("REFERRAL").status("CONTACTED").value(new BigDecimal("280000")).assignedTo("Guddu").build());

    leadRepository.save(Lead.builder().name("Manoj Gupta").email("manoj.g@example.com").phone("9123400003").source("SOCIAL_MEDIA").status("QUALIFIED").value(new BigDecimal("420000")).assignedTo("Bablu").build());

    leadRepository.save(Lead.builder().name("Kavita Joshi").email("kavita.j@example.com").phone("9123400004").source("COLD_CALL").status("PROPOSAL").value(new BigDecimal("560000")).assignedTo("Deepak Kushwaha").build());

    leadRepository.save(Lead.builder().name("Arjun Malhotra").email("arjun.m@example.com").phone("9123400005").source("ADVERTISEMENT").status("WON").value(new BigDecimal("750000")).assignedTo("Guddu").build());

    leadRepository.save(Lead.builder().name("Neha Kapoor").email("neha.k@example.com").phone("9123400006").source("WEBSITE").status("LOST").value(new BigDecimal("90000")).assignedTo("Bablu").build());

    leadRepository.save(Lead.builder().name("Farhan Sheikh").email("farhan.s@example.com").phone("9123400007").source("REFERRAL").status("NEW").value(new BigDecimal("310000")).assignedTo("Deepak Kushwaha").build());
}

        if (taskRepository.count() == 0) {
            taskRepository.save(Task.builder().title("Follow up with Vikram Industries").description("Discuss renewal of annual contract").assignedTo("Guddu").status("PENDING").priority("HIGH").dueDate(LocalDate.now().plusDays(2)).build());
            taskRepository.save(Task.builder().title("Prepare Q3 sales report").description("Compile sales figures for the third quarter").assignedTo("Bablu").status("IN_PROGRESS").priority("MEDIUM").dueDate(LocalDate.now().plusDays(5)).build());
            taskRepository.save(Task.builder().title("Onboard new employee").description("Complete onboarding paperwork and system access").assignedTo("Deepak Kushwaha").status("PENDING").priority("MEDIUM").dueDate(LocalDate.now().plusDays(1)).build());
            taskRepository.save(Task.builder().title("Client demo - Anjali Electronics").description("Product walkthrough call").assignedTo("Guddu").status("COMPLETED").priority("HIGH").dueDate(LocalDate.now().minusDays(1)).build());
            taskRepository.save(Task.builder().title("Update CRM database backup").description("Verify nightly backup job").assignedTo("Bablu").status("PENDING").priority("LOW").dueDate(LocalDate.now().plusDays(7)).build());
            taskRepository.save(Task.builder().title("Send proposal to Kavita Joshi").description("Finalize pricing and send PDF proposal").assignedTo("Bablu").status("PENDING").priority("URGENT").dueDate(LocalDate.now()).build());
        }

        if (employeeRepository.count() == 0) {
            employeeRepository.save(Employee.builder().name("Deepak Kushwaha").email("admin@trishulcrm.com").phone("9988770001").designation("Chief Executive Officer").department("Management").joiningDate(LocalDate.of(2019, 4, 1)).salary(new BigDecimal("250000")).status("ACTIVE").build());
            employeeRepository.save(Employee.builder().name("Guddu").email("supervisor@trishulcrm.com").phone("9988770002").designation("Sales Supervisor").department("Sales").joiningDate(LocalDate.of(2020, 6, 15)).salary(new BigDecimal("95000")).status("ACTIVE").build());
            employeeRepository.save(Employee.builder().name("Bablu").email("user@trishulcrm.com").phone("9988770003").designation("Sales Executive").department("Sales").joiningDate(LocalDate.of(2022, 1, 10)).salary(new BigDecimal("55000")).status("ACTIVE").build());
            employeeRepository.save(Employee.builder().name("Isha Kulkarni").email("isha.k@trishulcrm.com").phone("9988770004").designation("HR Manager").department("Human Resources").joiningDate(LocalDate.of(2021, 3, 20)).salary(new BigDecimal("70000")).status("ACTIVE").build());
            employeeRepository.save(Employee.builder().name("Dev Patel").email("dev.p@trishulcrm.com").phone("9988770005").designation("Support Engineer").department("Customer Support").joiningDate(LocalDate.of(2023, 8, 5)).salary(new BigDecimal("48000")).status("ON_LEAVE").build());
        }

        if (reportRepository.count() == 0) {
            reportRepository.save(Report.builder().title("Monthly Sales Report - July").type("SALES").summary("Overall sales grew 18% month over month driven by the Sales team's lead conversions.").generatedBy("Deepak Kushwaha").generatedDate(LocalDateTime.now().minusDays(3)).build());
            reportRepository.save(Report.builder().title("Customer Growth Report - Q2").type("CUSTOMER").summary("Customer base grew by 6 new active accounts across manufacturing and retail sectors.").generatedBy("Guddu").generatedDate(LocalDateTime.now().minusDays(10)).build());
            reportRepository.save(Report.builder().title("Lead Conversion Analysis").type("LEAD").summary("Conversion rate from qualified to won stands at 32% this quarter.").generatedBy("Guddu").generatedDate(LocalDateTime.now().minusDays(1)).build());
            reportRepository.save(Report.builder().title("Employee Performance Summary").type("EMPLOYEE").summary("Sales department exceeded targets; support tickets resolved within SLA 94% of the time.").generatedBy("Deepak Kushwaha").generatedDate(LocalDateTime.now().minusHours(6)).build());
        }

        if (settingRepository.count() == 0) {
            settingRepository.save(Setting.builder()
                    .companyName("Trishul Enterprises Pvt. Ltd.")
                    .companyEmail("info@trishulcrm.com")
                    .currency("INR")
                    .timezone("Asia/Kolkata")
                    .theme("dark")
                    .emailNotifications(true)
                    .smsNotifications(false)
                    .fiscalYearStart("April")
                    .build());
        }
    }

    private Role seedRole(String name) {
        return roleRepository.findByName(name)
                .orElseGet(() -> roleRepository.save(Role.builder().name(name).build()));
    }
}
