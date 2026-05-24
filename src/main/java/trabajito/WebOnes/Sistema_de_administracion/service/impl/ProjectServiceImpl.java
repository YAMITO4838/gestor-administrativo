package trabajito.WebOnes.Sistema_de_administracion.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import trabajito.WebOnes.Sistema_de_administracion.model.User;
import trabajito.WebOnes.Sistema_de_administracion.repository.ProjectRepository;
import trabajito.WebOnes.Sistema_de_administracion.repository.UserRepository;
import trabajito.WebOnes.Sistema_de_administracion.service.ProjectService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public Project saveProject(Project project) {
        if (project.getMembers() != null && !project.getMembers().isEmpty()) {
            project.setMembers(resolveMembers(project.getMembers()));
        }
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
            p.setLeaderName(details.getLeaderName());
            p.setStatus(details.getStatus());
            p.setPriority(details.getPriority());
            p.setBudget(details.getBudget());
            p.setEndDate(details.getEndDate());
            if (details.getMembers() != null) {
                p.setMembers(resolveMembers(details.getMembers()));
            }
            return projectRepository.save(p);
        }).orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    private List<User> resolveMembers(List<User> members) {
        return members.stream()
                .map(user -> userRepository.findById(user.getId())
                        .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + user.getId())))
                .collect(Collectors.toList());
    }
}