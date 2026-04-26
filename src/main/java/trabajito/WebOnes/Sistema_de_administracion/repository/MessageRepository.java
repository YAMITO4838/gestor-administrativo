package trabajito.WebOnes.Sistema_de_administracion.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import trabajito.WebOnes.Sistema_de_administracion.model.Message;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoomIdOrderBySentDateAsc(Long roomId);
}