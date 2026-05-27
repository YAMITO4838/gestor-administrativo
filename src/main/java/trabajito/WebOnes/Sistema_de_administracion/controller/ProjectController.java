package trabajito.WebOnes.Sistema_de_administracion.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import trabajito.WebOnes.Sistema_de_administracion.model.Task;
import trabajito.WebOnes.Sistema_de_administracion.model.TaskStatus;
import trabajito.WebOnes.Sistema_de_administracion.service.ProjectService;
import trabajito.WebOnes.Sistema_de_administracion.service.TaskService;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;

    @GetMapping
    public List<Project> getAll() {
        return projectService.findAllProjects();
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.saveProject(project);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getById(@PathVariable Long id) {
        return projectService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> update(@PathVariable Long id, @RequestBody Project project) {
        try {
            return ResponseEntity.ok(projectService.updateProject(id, project));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/tasks")
    public ResponseEntity<Task> createTask(@PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.status(201).body(taskService.createTaskForProject(id, task));
    }

    @GetMapping("/{id}/tasks")
    public List<Task> getTasksByProject(@PathVariable Long id) {
        return taskService.getTasksByProjectId(id);
    }

    @PutMapping("/tasks/{taskId}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long taskId,
            @RequestParam(required = false) TaskStatus status,
            @RequestBody(required = false) Task task) {
        if (task == null && status != null) {
            return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
        }
        if (task == null) {
            throw new RuntimeException("Debe enviar un cuerpo JSON para actualizar la tarea");
        }
        if (status != null) {
            task.setStatus(status);
        }
        return ResponseEntity.ok(taskService.updateTask(taskId, task));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        taskService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }
}
