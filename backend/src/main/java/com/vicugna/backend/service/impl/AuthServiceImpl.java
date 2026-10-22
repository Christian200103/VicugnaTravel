
package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.auth.*;
import com.vicugna.backend.entity.*;
import com.vicugna.backend.enums.*;
import com.vicugna.backend.repository.*;
import com.vicugna.backend.security.JwtService;
import com.vicugna.backend.service.AuthService;
import com.vicugna.backend.service.RefreshTokenService;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthServiceImpl(
            UsuarioRepository usuarioRepository,
            ClienteRepository clienteRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            UserDetailsService userDetailsService,
            JwtService jwtService,
            RefreshTokenService refreshTokenService) {

        this.usuarioRepository = usuarioRepository;
        this.clienteRepository = clienteRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    @Override
    @Transactional
    public AuthResponse registrar(RegistroRequest request) {

        String correo = request.getCorreo().trim().toLowerCase();

        if (usuarioRepository.existsByCorreo(correo)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El correo ya está registrado"
            );
        }

        Usuario usuario = new Usuario();
        usuario.setNombres(request.getNombres().trim());
        usuario.setApellidos(request.getApellidos().trim());
        usuario.setCorreo(correo);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Rol.CLIENTE);
        usuario.setEstado(EstadoUsuario.ACTIVO);

        usuario = usuarioRepository.save(usuario);

        Cliente cliente = new Cliente();
        cliente.setNombres(usuario.getNombres());
        cliente.setApellidos(usuario.getApellidos());
        cliente.setCorreo(usuario.getCorreo());
        cliente.setUsuario(usuario);

        clienteRepository.save(cliente);

        return generarRespuesta(usuario);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {

        String correo = request.getCorreo().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        correo,
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Credenciales inválidas"
                ));

        return generarRespuesta(usuario);
    }

    @Override
    @Transactional
    public AuthResponse refresh(String token) {

        RefreshToken anterior = refreshTokenService.validarToken(token);

        Usuario usuario = anterior.getUsuario();

        if (usuario.getEstado() != EstadoUsuario.ACTIVO) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "La cuenta no está activa"
            );
        }

        String nuevoRefreshToken =
                refreshTokenService.rotarToken(anterior);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(usuario.getCorreo());

        String accessToken = jwtService.generarToken(userDetails);

        return new AuthResponse(
                accessToken,
                nuevoRefreshToken,
                "Bearer",
                usuario.getId(),
                usuario.getNombres(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }

    @Override
    @Transactional
    public void logout(String token) {
        refreshTokenService.revocarToken(token);
    }

    private AuthResponse generarRespuesta(Usuario usuario) {

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(usuario.getCorreo());

        String accessToken = jwtService.generarToken(userDetails);

        String refreshToken = refreshTokenService.crearToken(usuario);

        return new AuthResponse(
                accessToken,
                refreshToken,
                "Bearer",
                usuario.getId(),
                usuario.getNombres(),
                usuario.getCorreo(),
                usuario.getRol().name()
        );
    }
}
