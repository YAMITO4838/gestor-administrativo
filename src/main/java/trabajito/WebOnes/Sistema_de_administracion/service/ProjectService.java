package trabajito.WebOnes.Sistema_de_administracion.service;

import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import java.util.List;
import java.util.Optional;

public interface ProjectService {
    Project saveProject(Project project);
    List<Project> findAllProjects();
    Optional<Project> findById(Long id);
    Project updateProject(Long id, Project projectDetails);
    void deleteProject(Long id);
}