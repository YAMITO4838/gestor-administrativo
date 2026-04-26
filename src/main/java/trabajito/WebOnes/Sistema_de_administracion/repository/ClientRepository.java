package trabajito.WebOnes.Sistema_de_administracion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabajito.WebOnes.Sistema_de_administracion.model.Client;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}