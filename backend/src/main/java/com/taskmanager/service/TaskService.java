package com.taskmanager.service;

import com.taskmanager.dto.TaskRequest;
import com.taskmanager.dto.TaskResponse;
import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import com.taskmanager.exception.ResourceNotFoundException;
import com.taskmanager.repository.TaskRepository;
import com.taskmanager.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public List<TaskResponse> getTasks(String username, TaskStatus status, TaskPriority priority) {
        User user = getUser(username);
        List<Task> tasks;
        if (status != null && priority != null) {
            tasks = taskRepository.findByUserAndStatusAndPriorityOrderByCreatedAtDesc(user, status, priority);
        } else if (status != null) {
            tasks = taskRepository.findByUserAndStatusOrderByCreatedAtDesc(user, status);
        } else if (priority != null) {
            tasks = taskRepository.findByUserAndPriorityOrderByCreatedAtDesc(user, priority);
        } else {
            tasks = taskRepository.findByUserOrderByCreatedAtDesc(user);
        }
        return tasks.stream().map(this::toResponse).toList();
    }

    public TaskResponse createTask(String username, TaskRequest request) {
        User user = getUser(username);
        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .status(request.status() != null ? request.status() : TaskStatus.TODO)
                .priority(request.priority() != null ? request.priority() : TaskPriority.MEDIUM)
                .dueDate(request.dueDate())
                .user(user)
                .build();
        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(String username, Long id, TaskRequest request) {
        Task task = getTaskByIdAndUser(id, username);
        task.setTitle(request.title());
        task.setDescription(request.description());
        if (request.status() != null) task.setStatus(request.status());
        if (request.priority() != null) task.setPriority(request.priority());
        task.setDueDate(request.dueDate());
        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(String username, Long id) {
        Task task = getTaskByIdAndUser(id, username);
        taskRepository.delete(task);
    }

    private Task getTaskByIdAndUser(Long id, String username) {
        User user = getUser(username);
        return taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
    }

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(), task.getTitle(), task.getDescription(),
                task.getStatus(), task.getPriority(), task.getDueDate(),
                task.getCreatedAt(), task.getUpdatedAt()
        );
    }
}
