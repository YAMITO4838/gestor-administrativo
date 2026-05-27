package trabajito.WebOnes.Sistema_de_administracion.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.User;
import trabajito.WebOnes.Sistema_de_administracion.repository.UserRepository;
import trabajito.WebOnes.Sistema_de_administracion.service.UserService;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User saveUser(User user) {
        // Aquí podrías agregar lógica para encriptar la contraseña antes de guardar
        return userRepository.save(user);
    }

    @Override
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> findUsersByRoleId(Long roleId) {
        return userRepository.findByRoleId(roleId);
    }

    @Override
    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(userDetails.getUsername());
            user.setFullName(userDetails.getFullName());
            user.setEmail(userDetails.getEmail());
            user.setRole(userDetails.getRole());
            user.setIsActive(userDetails.getIsActive());
            // Si el password viene en el body, se actualiza también
            if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
                user.setPassword(userDetails.getPassword());
            }
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
