package trabajito.WebOnes.Sistema_de_administracion.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import trabajito.WebOnes.Sistema_de_administracion.model.Message;
import trabajito.WebOnes.Sistema_de_administracion.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final ChatService chatService;

    // Obtener historial de una sala específica
    @GetMapping("/room/{roomId}")
    public List<Message> getHistory(@PathVariable Long roomId) {
        return chatService.getChatHistory(roomId);
    }

    // Se pasan los IDs por parámetro y el texto en el cuerpo
    @PostMapping("/send")
    public Message sendMessage(
            @RequestParam Long roomId, 
            @RequestParam Long senderId, 
            @RequestBody String content) {
        return chatService.sendMessage(roomId, senderId, content);
    }
}