package trabajito.WebOnes.Sistema_de_administracion.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import trabajito.WebOnes.Sistema_de_administracion.dto.AuthRequest;
import trabajito.WebOnes.Sistema_de_administracion.dto.AuthResponse;
import trabajito.WebOnes.Sistema_de_administracion.dto.RegisterRequest;
import trabajito.WebOnes.Sistema_de_administracion.model.Role;
import trabajito.WebOnes.Sistema_de_administracion.model.User;
import trabajito.WebOnes.Sistema_de_administracion.repository.RoleRepository;
import trabajito.WebOnes.Sistema_de_administracion.repository.UserRepository;
import trabajito.WebOnes.Sistema_de_administracion.security.CustomUserDetailsService;
import trabajito.WebOnes.Sistema_de_administracion.security.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            AuthenticationManager authenticationManager,
            CustomUserDetailsService userDetailsService,
            JwtService jwtService,
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        validateRegisterRequest(request);

        String roleName = normalizeRole(request.getRole());
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setFullName(resolveFullName(request));
        user.setEmail(request.getEmail().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
        String token = jwtService.generateToken(buildClaims(savedUser), userDetails);

        return ResponseEntity.status(HttpStatus.CREATED).body(toAuthResponse(token, savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (request.getUsernameOrEmail() == null || request.getUsernameOrEmail().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuario/email y password son obligatorios");
        }

        String login = request.getUsernameOrEmail().trim();
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(login, request.getPassword()));
        } catch (AuthenticationException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas");
        }

        User user = userRepository.findByUsernameOrEmail(login, login)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invalidas"));
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String token = jwtService.generateToken(buildClaims(user), userDetails);

        return ResponseEntity.ok(toAuthResponse(token, user));
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request.getUsername() == null || request.getUsername().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El username es obligatorio");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El email es obligatorio");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El password es obligatorio");
        }
        if (userRepository.existsByUsername(request.getUsername().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese username");
        }
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese email");
        }
    }

    private String resolveFullName(RegisterRequest request) {
        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            return request.getFullName().trim();
        }
        return request.getUsername().trim();
    }

    private String normalizeRole(String role) {
        if (role == null || role.isBlank()) {
            return "MEMBER";
        }
        String normalizedRole = role.trim().toUpperCase();
        if (normalizedRole.startsWith("ROLE_")) {
            normalizedRole = normalizedRole.substring(5);
        }
        if (!normalizedRole.equals("ADMIN")
                && !normalizedRole.equals("PROJECT_LEADER")
                && !normalizedRole.equals("MEMBER")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Rol invalido. Use ADMIN, PROJECT_LEADER o MEMBER"
            );
        }
        return normalizedRole;
    }

    private Map<String, Object> buildClaims(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().getName());
        return claims;
    }

    private AuthResponse toAuthResponse(String token, User user) {
        return new AuthResponse(token, user.getUsername(), user.getEmail(), user.getRole().getName());
    }
}
