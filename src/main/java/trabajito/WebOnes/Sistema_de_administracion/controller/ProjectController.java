package trabajito.WebOnes.Sistema_de_administracion.controller;

import org.springframework.web.bind.annotation.*;
import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import trabajito.WebOnes.Sistema_de_administracion.model.Task;
import trabajito.WebOnes.Sistema_de_administracion.service.ProjectService;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // Endpoint 1 - Crear proyecto
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    // Endpoint 2 - Listar proyectos
    @GetMapping
    public List<Project> getProjects() {
        return projectService.findAllProjects();
    }

    // Endpoint 3 - Asignar tarea
    @PostMapping("/{id}/tasks")
    public Task assignTask(
            @PathVariable Long id,
            @RequestBody Task task) {

        return projectService.assignTaskToProject(id, task);
    }

    // Endpoint 4 (Extra para mejor nota)
    @PutMapping("/tasks/{taskId}")
    public Task updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam String status) {

        return projectService.updateTaskStatus(taskId, status);
    }
}