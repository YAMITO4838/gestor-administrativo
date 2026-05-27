package trabajito.WebOnes.Sistema_de_administracion.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.Task;
import trabajito.WebOnes.Sistema_de_administracion.model.TaskStatus;
import trabajito.WebOnes.Sistema_de_administracion.repository.TaskRepository;
import trabajito.WebOnes.Sistema_de_administracion.repository.ProjectRepository;
import trabajito.WebOnes.Sistema_de_administracion.repository.UserRepository;
import trabajito.WebOnes.Sistema_de_administracion.service.TaskService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public Task createTaskForProject(Long projectId, Task task) {
        return projectRepository.findById(projectId).map(project -> {
            task.setProject(project);
            if (task.getStatus() == null) {
                task.setStatus(TaskStatus.PENDING);
            }
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("No se puede crear tarea: Proyecto no encontrado"));
    }

    @Override
    public List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public Optional<Task> findTaskById(Long id) {
        return taskRepository.findById(id);
    }

    @Override
    public Task updateTask(Long taskId, Task details) {
        return taskRepository.findById(taskId).map(task -> {
            task.setTitle(details.getTitle());
            task.setDescription(details.getDescription());
            task.setAssignedTo(details.getAssignedTo());
            task.setStatus(details.getStatus());
            task.setPriority(details.getPriority());
            task.setStartDate(details.getStartDate());
            task.setDueDate(details.getDueDate());
            if (details.getAssignee() != null) {
                task.setAssignee(details.getAssignee());
            }
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + taskId));
    }

    @Override
    public Task updateTaskStatus(Long taskId, TaskStatus status) {
        return taskRepository.findById(taskId).map(task -> {
            task.setStatus(status);
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Tarea no encontrada con id: " + taskId));
    }

    @Override
    public Task assignTaskToUser(Long taskId, Long userId) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        
        return userRepository.findById(userId).map(user -> {
            task.setAssignee(user);
            if (user.getFullName() != null && !user.getFullName().isBlank()) {
                task.setAssignedTo(user.getFullName());
            } else {
                task.setAssignedTo(user.getUsername());
            }
            return taskRepository.save(task);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + userId));
    }

    @Override
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new RuntimeException("Tarea no encontrada con id: " + id);
        }
        taskRepository.deleteById(id);
    }
}
