package trabajito.WebOnes.Sistema_de_administracion.service;

import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import trabajito.WebOnes.Sistema_de_administracion.model.Task;
import java.util.List;
import java.util.Optional;

public interface ProjectService {

    Project saveProject(Project project);
    List<Project> findAllProjects();
    Optional<Project> findById(Long id);
    Project updateProject(Long id, Project project);
    Task assignTaskToProject(Long projectId, Task task);
    Task updateTaskStatus(Long taskId, String status);
    void deleteProject(Long id);
    List<Task> getTasksByProject(Long projectId);
}