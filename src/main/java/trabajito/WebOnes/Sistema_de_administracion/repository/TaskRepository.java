package trabajito.WebOnes.Sistema_de_administracion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabajito.WebOnes.Sistema_de_administracion.model.Task;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByAssigneeId(Long userId);
}