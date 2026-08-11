package com.trishul.crm.service;

import com.trishul.crm.entity.Employee;
import com.trishul.crm.exception.ResourceNotFoundException;
import com.trishul.crm.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public List<Employee> getAll() {
        return employeeRepository.findAll();
    }

    public Employee getById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Transactional
    public Employee create(Employee employee) {
        return employeeRepository.save(employee);
    }

    @Transactional
    public Employee update(Long id, Employee payload) {
        Employee existing = getById(id);
        existing.setName(payload.getName());
        existing.setEmail(payload.getEmail());
        existing.setPhone(payload.getPhone());
        existing.setDesignation(payload.getDesignation());
        existing.setDepartment(payload.getDepartment());
        existing.setJoiningDate(payload.getJoiningDate());
        existing.setSalary(payload.getSalary());
        existing.setStatus(payload.getStatus());
        return employeeRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Employee existing = getById(id);
        employeeRepository.delete(existing);
    }
}
