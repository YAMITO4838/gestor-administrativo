package trabajito.WebOnes.Sistema_de_administracion.service;

import trabajito.WebOnes.Sistema_de_administracion.model.Task;
import trabajito.WebOnes.Sistema_de_administracion.model.TaskStatus;
import java.util.List;
import java.util.Optional;

public interface TaskService {

    Task createTaskForProject(Long projectId, Task task);
    
    List<Task> getTasksByProjectId(Long projectId);
    
    Optional<Task> findTaskById(Long id);

    Task updateTask(Long taskId, Task taskDetails);
    
    // Actualizar el estado (PENDING, IN_PROGRESS, COMPLETED)
    Task updateTaskStatus(Long taskId, TaskStatus status);
    
    // Asignar la tarea a un desarrollador/diseñador
    Task assignTaskToUser(Long taskId, Long userId);
    
    // Eliminar una tarea
    void deleteTask(Long id);
}
