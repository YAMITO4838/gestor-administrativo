package trabajito.WebOnes.Sistema_de_administracion.service;

import trabajito.WebOnes.Sistema_de_administracion.model.ChatRoom;
import trabajito.WebOnes.Sistema_de_administracion.model.Message;
import java.util.List;
import java.util.Optional;

public interface ChatService {

    // GESTIÓN DE SALAS DE CHAT (Rooms)
    ChatRoom createRoomForProject(Long projectId, String roomName);
    
    List<ChatRoom> getRoomsByProjectId(Long projectId);
    
    Optional<ChatRoom> findRoomById(Long roomId);

    // GESTIÓN DE MENSAJES (Historial)
    
    // Enviar y guardar un nuevo mensaje en la base de datos
    Message sendMessage(Long roomId, Long senderId, String content);
    
    // Obtener el historial completo de mensajes de una sala 
    List<Message> getChatHistory(Long roomId);
}