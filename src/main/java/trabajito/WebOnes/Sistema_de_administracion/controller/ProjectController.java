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

    // 1. Crear proyecto
    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    // 2. Listar proyectos
    @GetMapping
    public List<Project> getProjects() {
        return projectService.findAllProjects();
    }

    

    // 3. Buscar por ID
    @GetMapping("/{id}")
    public Project getProjectById(@PathVariable Long id) {
        return projectService.findById(id).orElse(null);
    }

    // 4. Actualizar proyecto
    @PutMapping("/{id}")
    public Project updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {

        return projectService.updateProject(id, project);
    }

    // 5. Asignar tarea
    @PostMapping("/{id}/tasks")
    public Task assignTask(
            @PathVariable Long id,
            @RequestBody Task task) {

        return projectService.assignTaskToProject(id, task);
    }

    // 6. Obtener tareas de un proyecto
    @GetMapping("/{id}/tasks")
    public List<Task> getTasksByProject(@PathVariable Long id){
        return projectService.getTasksByProject(id);
    }

        // 7. Actualizar estado tarea
    @PutMapping("/tasks/{taskId}")
    public Task updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam String status) {

        return projectService.updateTaskStatus(taskId, status);
    }
    //8.Eliminar proyecto
    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Long id){
        projectService.deleteProject(id);
    }
}