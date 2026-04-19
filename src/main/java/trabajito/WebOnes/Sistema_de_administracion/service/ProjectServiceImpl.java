package trabajito.WebOnes.Sistema_de_administracion.service;

import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.*;
import trabajito.WebOnes.Sistema_de_administracion.repository.*;

import java.util.List;
import java.util.Optional;

@SuppressWarnings("all")
@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepo;
    private final TaskRepository taskRepo;

    public ProjectServiceImpl(ProjectRepository projectRepo, TaskRepository taskRepo) {
        this.projectRepo = projectRepo;
        this.taskRepo = taskRepo;
    }

    @Override
    public Project saveProject(Project project) {
        return projectRepo.save(project);
    }

    @Override
    public List<Project> findAllProjects() {
        return projectRepo.findAll();
    }

    @Override
    public Optional<Project> findById(Long id) {
        return projectRepo.findById(id);
    }

    @Override
    public Task assignTaskToProject(Long projectId, Task task) {

        Optional<Project> project = projectRepo.findById(projectId);

        if(project.isPresent()){
            task.setProject(project.get());
            return taskRepo.save(task);
        }

        return null;
    }

    @Override
    public Task updateTaskStatus(Long taskId, String status) {

        Optional<Task> task = taskRepo.findById(taskId);

        if(task.isPresent()){
            Task t = task.get();
            t.setStatus(status);
            return taskRepo.save(t);
        }

        return null;
    }
}