package trabajito.WebOnes.Sistema_de_administracion.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.ChatRoom;
import trabajito.WebOnes.Sistema_de_administracion.model.Message;
import trabajito.WebOnes.Sistema_de_administracion.repository.ChatRoomRepository;
import trabajito.WebOnes.Sistema_de_administracion.repository.MessageRepository;
import trabajito.WebOnes.Sistema_de_administracion.repository.ProjectRepository;
import trabajito.WebOnes.Sistema_de_administracion.repository.UserRepository;
import trabajito.WebOnes.Sistema_de_administracion.service.ChatService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final MessageRepository messageRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Override
    public ChatRoom createRoomForProject(Long projectId, String roomName) {
        return projectRepository.findById(projectId).map(project -> {
            ChatRoom room = new ChatRoom();
            room.setProject(project);
            room.setRoomName(roomName);
            return chatRoomRepository.save(room);
        }).orElseThrow(() -> new RuntimeException("Proyecto no encontrado para crear la sala"));
    }

    @Override
    public List<ChatRoom> getRoomsByProjectId(Long projectId) {
        return chatRoomRepository.findByProjectId(projectId);
    }

    @Override
    public Optional<ChatRoom> findRoomById(Long roomId) {
        return chatRoomRepository.findById(roomId);
    }

    @Override
    public Message sendMessage(Long roomId, Long senderId, String content) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));
        
        return userRepository.findById(senderId).map(user -> {
            Message message = new Message();
            message.setRoom(room);
            message.setSender(user);
            message.setContent(content);
            return messageRepository.save(message);
        }).orElseThrow(() -> new RuntimeException("Usuario emisor no encontrado"));
    }

    @Override
    public List<Message> getChatHistory(Long roomId) {
        return messageRepository.findByRoomIdOrderBySentDateAsc(roomId);
    }
}