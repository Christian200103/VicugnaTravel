package com.vicugna.backend.security;

import com.vicugna.backend.entity.Usuario;
import com.vicugna.backend.enums.EstadoUsuario;
import com.vicugna.backend.repository.UsuarioRepository;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Usuario no encontrado"));

        return User.builder()
                .username(usuario.getCorreo())
                .password(usuario.getPassword())
                .authorities("ROLE_" + usuario.getRol().name())
                .disabled(usuario.getEstado() != EstadoUsuario.ACTIVO)
                .accountLocked(usuario.getEstado() == EstadoUsuario.BLOQUEADO)
                .build();
    }
}