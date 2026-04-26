package trabajito.WebOnes.Sistema_de_administracion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabajito.WebOnes.Sistema_de_administracion.model.Role;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
}