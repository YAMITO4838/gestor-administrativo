package trabajito.WebOnes.Sistema_de_administracion.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.*;
import trabajito.WebOnes.Sistema_de_administracion.repository.*;

import java.time.LocalDate;
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

        project.setCreatedAt(LocalDate.now());
        project.setUpdatedAt(LocalDate.now());

        return projectRepo.save(project);
    }


    @Override
    public List<Task> getTasksByProject(Long projectId){

        Project project = projectRepo.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));

        return project.getTasks();
    }
    @Override
    public List<Project> findAllProjects() {
        return projectRepo.findAll();
    }

    @Override
    public Optional<Project> findById(Long id) {
        return projectRepo.findById(id);
    }

    // NUEVO UPDATE PROJECT
    public Project updateProject(Long id, Project projectDetails) {

        Optional<Project> projectOptional = projectRepo.findById(id);

        if(projectOptional.isPresent()){

            Project project = projectOptional.get();

            project.setName(projectDetails.getName());
            project.setDescription(projectDetails.getDescription());
            project.setLeaderName(projectDetails.getLeaderName());
            project.setClientName(projectDetails.getClientName());
            project.setStartDate(projectDetails.getStartDate());
            project.setEndDate(projectDetails.getEndDate());
            project.setStatus(projectDetails.getStatus());
            project.setPriority(projectDetails.getPriority());
            project.setBudget(projectDetails.getBudget());

            project.setUpdatedAt(LocalDate.now());

            return projectRepo.save(project);
        }

        return null;
    }

        @Override
        public Task assignTaskToProject(Long projectId, Task task) {

            Optional<Project> project = projectRepo.findById(projectId);

            if(project.isPresent()){

                task.setProject(project.get());

                task.setCreatedAt(LocalDate.now());
                task.setUpdatedAt(LocalDate.now());

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
            t.setUpdatedAt(LocalDate.now());
            return taskRepo.save(t);
        }

        return null;
    }
    @Override
    public void deleteProject(Long id){
        projectRepo.deleteById(id);
    }
}