package com.taskmanager.dto;

import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record TaskRequest(
        @NotBlank @Size(max = 200) String title,
        String description,
        TaskStatus status,
        TaskPriority priority,
        LocalDateTime dueDate
) {}
