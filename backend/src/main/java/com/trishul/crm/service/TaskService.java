package com.trishul.crm.service;

import com.trishul.crm.entity.Task;
import com.trishul.crm.exception.ResourceNotFoundException;
import com.trishul.crm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public Task getById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    @Transactional
    public Task create(Task task) {
        return taskRepository.save(task);
    }

    @Transactional
    public Task update(Long id, Task payload) {
        Task existing = getById(id);
        existing.setTitle(payload.getTitle());
        existing.setDescription(payload.getDescription());
        existing.setAssignedTo(payload.getAssignedTo());
        existing.setStatus(payload.getStatus());
        existing.setPriority(payload.getPriority());
        existing.setDueDate(payload.getDueDate());
        return taskRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Task existing = getById(id);
        taskRepository.delete(existing);
    }
}
