
package com.vicugna.backend.controller;

import com.vicugna.backend.dto.perfil.PerfilResponse;
import com.vicugna.backend.service.PerfilService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vicugna.backend.dto.perfil.PerfilActualizarRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.vicugna.backend.dto.perfil.CambiarPasswordRequest;
import org.springframework.http.HttpStatus;
@RestController
@RequestMapping("/api/perfil")
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping("/mi-perfil")
    @PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")
    public ResponseEntity<PerfilResponse> obtenerMiPerfil(
            Authentication authentication) {

        return ResponseEntity.ok(
                perfilService.obtenerMiPerfil(
                        authentication.getName()
                )
        );
    }

	@PutMapping("/mi-perfil")
	@PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")
	public ResponseEntity<PerfilResponse> actualizarMiPerfil(
	        Authentication authentication,
	        @Valid @RequestBody PerfilActualizarRequest request) {
	
	    return ResponseEntity.ok(
	            perfilService.actualizarMiPerfil(
	                    authentication.getName(),
	                    request
	            )
	    );
	}

	@PutMapping("/cambiar-password")
	@PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")
	public ResponseEntity<Void> cambiarPassword(
	        Authentication authentication,
	        @Valid @RequestBody CambiarPasswordRequest request) {
	
	    perfilService.cambiarPassword(
	            authentication.getName(),
	            request
	    );
	
	    return ResponseEntity
	            .status(HttpStatus.NO_CONTENT)
	            .build();
	}


}
