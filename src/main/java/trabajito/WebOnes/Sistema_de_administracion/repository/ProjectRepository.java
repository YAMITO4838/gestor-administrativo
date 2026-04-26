package trabajito.WebOnes.Sistema_de_administracion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabajito.WebOnes.Sistema_de_administracion.model.Project;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByClientName(String clientName);
    List<Project> findByLeaderName(String leaderName);
}