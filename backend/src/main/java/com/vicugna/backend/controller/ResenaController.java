
package com.vicugna.backend.controller;

import com.vicugna.backend.dto.resena.ResenaRequest;
import com.vicugna.backend.dto.resena.ResenaResponse;
import com.vicugna.backend.service.ResenaService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    private final ResenaService resenaService;

    public ResenaController(ResenaService resenaService) {
        this.resenaService = resenaService;
    }

    // Crear reseña: cualquier usuario autenticado
    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")
    public ResponseEntity<ResenaResponse> crear(
            @Valid @RequestBody ResenaRequest request,
            Authentication authentication) {

        ResenaResponse respuesta = resenaService.crear(
                request,
                authentication.getName()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(respuesta);
    }

    // Consultar reseñas de un tour
    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<ResenaResponse>> listarPorTour(
            @PathVariable Long tourId) {

        return ResponseEntity.ok(
                resenaService.listarPorTour(tourId)
        );
    }

    // Consultar mis reseñas
    @GetMapping("/mis-resenas")
    @PreAuthorize("hasAnyRole('CLIENTE', 'ADMIN')")
    public ResponseEntity<List<ResenaResponse>> listarMisResenas(
            Authentication authentication) {

        return ResponseEntity.ok(
                resenaService.listarMisResenas(
                        authentication.getName()
                )
        );
    }

    // Consultar todas las reseñas: ADMIN
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ResenaResponse>> listarTodas() {

        return ResponseEntity.ok(
                resenaService.listarTodas()
        );
    }

    // Promedio y cantidad de reseñas por tour
    @GetMapping("/tour/{tourId}/resumen")
    public ResponseEntity<Map<String, Object>> obtenerResumen(
            @PathVariable Long tourId) {

        return ResponseEntity.ok(Map.of(
                "tourId", tourId,
                "promedio", resenaService.obtenerPromedio(tourId),
                "cantidadResenas", resenaService.contarPorTour(tourId)
        ));
    }

    // Eliminar reseña: ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long id) {

        resenaService.eliminar(id);

        return ResponseEntity.noContent().build();
    }
}
