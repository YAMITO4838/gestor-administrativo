package trabajito.WebOnes.Sistema_de_administracion.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import trabajito.WebOnes.Sistema_de_administracion.model.Task;
import trabajito.WebOnes.Sistema_de_administracion.model.TaskStatus;
import trabajito.WebOnes.Sistema_de_administracion.service.TaskService;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/project/{projectId}")
    public Task create(@PathVariable Long projectId, @RequestBody Task task) {
        return taskService.createTaskForProject(projectId, task);
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getByProject(@PathVariable Long projectId) {
        return taskService.getTasksByProjectId(projectId);
    }

    @PatchMapping("/{id}/status")
    public Task updateStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        return taskService.updateTaskStatus(id, status);
    }

    @PatchMapping("/{id}/assign/{userId}")
    public Task assignUser(@PathVariable Long id, @PathVariable Long userId) {
        return taskService.assignTaskToUser(id, userId);
    }
}