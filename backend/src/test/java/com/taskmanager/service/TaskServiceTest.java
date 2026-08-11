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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    private User user;
    private Task task;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).username("testuser").email("test@test.com").password("pass").build();
        task = Task.builder()
                .id(1L).title("Test task").status(TaskStatus.TODO)
                .priority(TaskPriority.MEDIUM).user(user)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void getTasks_returnsUserTasks() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(taskRepository.findByUserOrderByCreatedAtDesc(user)).thenReturn(List.of(task));

        List<TaskResponse> result = taskService.getTasks("testuser", null, null);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("Test task");
    }

    @Test
    void createTask_savesAndReturnsTask() {
        TaskRequest request = new TaskRequest("New task", "desc", TaskStatus.TODO, TaskPriority.HIGH, null);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(
                Task.builder().id(2L).title("New task").description("desc")
                        .status(TaskStatus.TODO).priority(TaskPriority.HIGH).user(user)
                        .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build()
        );

        TaskResponse result = taskService.createTask("testuser", request);

        assertThat(result.title()).isEqualTo("New task");
        assertThat(result.priority()).isEqualTo(TaskPriority.HIGH);
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void deleteTask_throwsWhenNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUser(99L, user)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> taskService.deleteTask("testuser", 99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }
}
