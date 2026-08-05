package com.trishul.crm.service;

import com.trishul.crm.entity.Lead;
import com.trishul.crm.exception.ResourceNotFoundException;
import com.trishul.crm.repository.LeadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LeadService {

    private final LeadRepository leadRepository;

    public List<Lead> getAll() {
        return leadRepository.findAll();
    }

    public Lead getById(Long id) {
        return leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
    }

    @Transactional
    public Lead create(Lead lead) {
        return leadRepository.save(lead);
    }

    @Transactional
    public Lead update(Long id, Lead payload) {
        Lead existing = getById(id);
        existing.setName(payload.getName());
        existing.setEmail(payload.getEmail());
        existing.setPhone(payload.getPhone());
        existing.setSource(payload.getSource());
        existing.setStatus(payload.getStatus());
        existing.setValue(payload.getValue());
        existing.setAssignedTo(payload.getAssignedTo());
        return leadRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Lead existing = getById(id);
        leadRepository.delete(existing);
    }
}
