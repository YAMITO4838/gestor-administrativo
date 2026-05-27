package trabajito.WebOnes.Sistema_de_administracion.security;

import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import trabajito.WebOnes.Sistema_de_administracion.model.User;
import trabajito.WebOnes.Sistema_de_administracion.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + usernameOrEmail));

        String roleName = "MEMBER";
        if (user.getRole() != null && user.getRole().getName() != null) {
            roleName = user.getRole().getName().trim().toUpperCase();
            if (roleName.startsWith("ROLE_")) {
                roleName = roleName.substring(5);
            }
        }

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .disabled(!Boolean.TRUE.equals(user.getIsActive()))
                .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + roleName)))
                .build();
    }
}
