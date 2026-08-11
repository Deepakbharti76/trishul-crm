package com.trishul.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Trishul CRM - Smart Business Management System
 * Entry point of the Spring Boot application.
 */
@SpringBootApplication
public class TrishulCrmApplication {

    public static void main(String[] args) {
        SpringApplication.run(TrishulCrmApplication.class, args);
        System.out.println("========================================================");
        System.out.println(" Trishul CRM Backend is running on http://localhost:8080");
        System.out.println("========================================================");
    }
}
