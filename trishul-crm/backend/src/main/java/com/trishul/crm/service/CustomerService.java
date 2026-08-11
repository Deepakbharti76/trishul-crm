package com.trishul.crm.service;

import com.trishul.crm.entity.Customer;
import com.trishul.crm.exception.ResourceNotFoundException;
import com.trishul.crm.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<Customer> getAll() {
        return customerRepository.findAll();
    }

    public Customer getById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Transactional
    public Customer create(Customer customer) {
        return customerRepository.save(customer);
    }

    @Transactional
    public Customer update(Long id, Customer payload) {
        Customer existing = getById(id);
        existing.setName(payload.getName());
        existing.setEmail(payload.getEmail());
        existing.setPhone(payload.getPhone());
        existing.setCompany(payload.getCompany());
        existing.setAddress(payload.getAddress());
        existing.setStatus(payload.getStatus());
        return customerRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Customer existing = getById(id);
        customerRepository.delete(existing);
    }

    public long countActive() {
        return customerRepository.countByStatus("ACTIVE");
    }
}
