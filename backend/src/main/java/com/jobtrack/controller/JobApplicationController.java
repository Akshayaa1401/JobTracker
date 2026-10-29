package com.jobtrack.controller;

import com.jobtrack.model.JobApplication;
import com.jobtrack.repository.JobApplicationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class JobApplicationController {
    private final JobApplicationRepository repository;
    private static final Set<String> VALID_STATUSES = Set.of("Applied", "Interview", "Selected", "Rejected");

    public JobApplicationController(JobApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<JobApplication> getAll() {
        return repository.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobApplication create(@RequestBody JobApplication application) {
        if (application.getCompanyName() == null || application.getCompanyName().isBlank()
                || application.getJobRole() == null || application.getJobRole().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name and job role are required.");
        }
        if (application.getStatus() == null || !VALID_STATUSES.contains(application.getStatus())) {
            application.setStatus("Applied");
        }
        application.setId(null);
        return repository.save(application);
    }

    @PatchMapping("/{id}/status")
    public JobApplication updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        JobApplication application = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found."));
        String status = body.get("status");
        if (status == null || !VALID_STATUSES.contains(status)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status.");
        }
        application.setStatus(status);
        return repository.save(application);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found.");
        }
        repository.deleteById(id);
    }
}