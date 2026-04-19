package trabajito.WebOnes.Sistema_de_administracion.service;

import java.util.List;
import java.util.Optional;

import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import trabajito.WebOnes.Sistema_de_administracion.model.Task;

public interface ProjectService {

    Project saveProject(Project project);

    List<Project> findAllProjects();

    Optional<Project> findById(Long id);

    Task assignTaskToProject(Long projectId, Task task);

    Task updateTaskStatus(Long taskId, String status);
}