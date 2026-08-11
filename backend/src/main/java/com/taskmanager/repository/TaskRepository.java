package com.taskmanager.repository;

import com.taskmanager.entity.Task;
import com.taskmanager.entity.TaskPriority;
import com.taskmanager.entity.TaskStatus;
import com.taskmanager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserOrderByCreatedAtDesc(User user);
    List<Task> findByUserAndStatusOrderByCreatedAtDesc(User user, TaskStatus status);
    List<Task> findByUserAndPriorityOrderByCreatedAtDesc(User user, TaskPriority priority);
    List<Task> findByUserAndStatusAndPriorityOrderByCreatedAtDesc(User user, TaskStatus status, TaskPriority priority);
    Optional<Task> findByIdAndUser(Long id, User user);
}
