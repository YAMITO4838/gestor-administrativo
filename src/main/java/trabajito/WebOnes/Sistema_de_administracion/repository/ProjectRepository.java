package trabajito.WebOnes.Sistema_de_administracion.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import trabajito.WebOnes.Sistema_de_administracion.model.Project;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}