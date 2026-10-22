
package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.perfil.PerfilResponse;
import com.vicugna.backend.dto.perfil.PerfilActualizarRequest;

import com.vicugna.backend.entity.Usuario;
import com.vicugna.backend.entity.Cliente;

import com.vicugna.backend.repository.UsuarioRepository;
import com.vicugna.backend.repository.ClienteRepository;

import com.vicugna.backend.service.PerfilService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.vicugna.backend.dto.perfil.CambiarPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.vicugna.backend.service.RefreshTokenService;
@Service
public class PerfilServiceImpl implements PerfilService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

	public PerfilServiceImpl(
	        UsuarioRepository usuarioRepository,
	        ClienteRepository clienteRepository,
	        PasswordEncoder passwordEncoder,
	        RefreshTokenService refreshTokenService) {
	
	    this.usuarioRepository = usuarioRepository;
	    this.clienteRepository = clienteRepository;
	    this.passwordEncoder = passwordEncoder;
	    this.refreshTokenService = refreshTokenService;
	}



    @Override
    @Transactional(readOnly = true)
    public PerfilResponse obtenerMiPerfil(String correoUsuario) {

        Usuario usuario = usuarioRepository
                .findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"
                ));

        return convertirAPerfilResponse(usuario);
    }

    @Override
    @Transactional
    public PerfilResponse actualizarMiPerfil(
            String correoUsuario,
            PerfilActualizarRequest request) {

        // Buscar usuario autenticado
        Usuario usuario = usuarioRepository
                .findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"
                ));

        String nombres = request.getNombres().trim();
        String apellidos = request.getApellidos().trim();

        // Actualizar tabla usuarios
        usuario.setNombres(nombres);
        usuario.setApellidos(apellidos);

        usuarioRepository.save(usuario);

        // Actualizar cliente vinculado, si existe
        clienteRepository.findByUsuarioId(usuario.getId())
                .ifPresent(cliente -> {

                    cliente.setNombres(nombres);
                    cliente.setApellidos(apellidos);

                    clienteRepository.save(cliente);
                });

        return convertirAPerfilResponse(usuario);
    }

    private PerfilResponse convertirAPerfilResponse(
            Usuario usuario) {

        PerfilResponse response = new PerfilResponse();

        response.setId(usuario.getId());
        response.setNombres(usuario.getNombres());
        response.setApellidos(usuario.getApellidos());
        response.setCorreo(usuario.getCorreo());
        response.setRol(usuario.getRol().name());
        response.setEstado(usuario.getEstado().name());
        response.setFechaRegistro(usuario.getFechaRegistro());

        return response;
    }


	@Override
	@Transactional
	public void cambiarPassword(
	        String correoUsuario,
	        CambiarPasswordRequest request) {
	
	    Usuario usuario = usuarioRepository
	            .findByCorreo(correoUsuario)
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND,
	                    "Usuario no encontrado"
	            ));
	
	    // Verificar contraseña actual
	    if (!passwordEncoder.matches(
	            request.getPasswordActual(),
	            usuario.getPassword())) {
	
	        throw new ResponseStatusException(
	                HttpStatus.BAD_REQUEST,
	                "La contraseña actual es incorrecta"
	        );
	    }
	
	    // Evitar reutilizar la contraseña anterior
	    if (passwordEncoder.matches(
	            request.getPasswordNueva(),
	            usuario.getPassword())) {
	
	        throw new ResponseStatusException(
	                HttpStatus.BAD_REQUEST,
	                "La nueva contraseña debe ser diferente a la actual"
	        );
	    }
	
	    // Guardar la nueva contraseña cifrada
	    usuario.setPassword(
	            passwordEncoder.encode(request.getPasswordNueva())
	    );
	
	    usuarioRepository.save(usuario);
	
	    // Revocar todos los refresh tokens del usuario
	    refreshTokenService.revocarTodosPorUsuario(
	            usuario.getId()
	    );
	}

}
