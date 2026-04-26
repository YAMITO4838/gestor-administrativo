package trabajito.WebOnes.Sistema_de_administracion.service;

import trabajito.WebOnes.Sistema_de_administracion.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {

    User saveUser(User user);
    
    List<User> findAllUsers();
    
    Optional<User> findById(Long id);
    
    Optional<User> findByEmail(String email);
    
    // Listar usuarios filtrados por su rol (Ej: Traer solo a los desarrolladores)
    List<User> findUsersByRoleId(Long roleId);
    
    User updateUser(Long id, User userDetails);
    
    void deleteUser(Long id);
}