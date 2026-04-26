package trabajito.WebOnes.Sistema_de_administracion.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import trabajito.WebOnes.Sistema_de_administracion.model.ChatRoom;
import trabajito.WebOnes.Sistema_de_administracion.model.Message;
import trabajito.WebOnes.Sistema_de_administracion.service.ChatService;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {
    private final ChatService chatService;

    @PostMapping("/rooms/project/{projectId}")
    public ChatRoom createRoom(@PathVariable Long projectId, @RequestParam String name) {
        return chatService.createRoomForProject(projectId, name);
    }

    @GetMapping("/history/{roomId}")
    public List<Message> getHistory(@PathVariable Long roomId) {
        return chatService.getChatHistory(roomId);
    }

    @PostMapping("/send")
    public Message sendMessage(@RequestParam Long roomId, @RequestParam Long senderId, @RequestBody String content) {
        return chatService.sendMessage(roomId, senderId, content);
    }
}