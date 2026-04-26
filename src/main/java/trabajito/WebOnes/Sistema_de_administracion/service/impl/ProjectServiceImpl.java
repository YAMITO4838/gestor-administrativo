package trabajito.WebOnes.Sistema_de_administracion.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import trabajito.WebOnes.Sistema_de_administracion.repository.ProjectRepository;
import trabajito.WebOnes.Sistema_de_administracion.service.ProjectService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    @Override
    public Project saveProject(Project project) {
        return projectRepository.save(project);
    }

    @Override
    public List<Project> findAllProjects() {
        return projectRepository.findAll();
    }

    @Override
    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    @Override
    public Project updateProject(Long id, Project details) {
        return projectRepository.findById(id).map(p -> {
            p.setName(details.getName());
            p.setDescription(details.getDescription());
            p.setClient(details.getClient());
            p.setLeader(details.getLeader());
            p.setStatus(details.getStatus());
            p.setPriority(details.getPriority());
            p.setBudget(details.getBudget());
            p.setEndDate(details.getEndDate());
            return projectRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
