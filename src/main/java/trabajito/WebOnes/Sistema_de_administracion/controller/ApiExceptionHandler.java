package trabajito.WebOnes.Sistema_de_administracion.controller;

import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> handleResponseStatusException(ResponseStatusException ex) {
        String message = ex.getReason() == null ? "Error en la solicitud" : ex.getReason();
        return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", message));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        String message = ex.getMessage() == null ? "Error en la solicitud" : ex.getMessage();
        String normalized = message.toLowerCase();
        if (normalized.contains("no encontrado") || normalized.contains("not found")) {
            status = HttpStatus.NOT_FOUND;
        }
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
