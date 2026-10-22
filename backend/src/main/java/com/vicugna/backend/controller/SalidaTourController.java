
package com.vicugna.backend.controller;

import com.vicugna.backend.dto.tour.SalidaTourRequest;
import com.vicugna.backend.dto.tour.SalidaTourResponse;
import com.vicugna.backend.service.SalidaTourService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salidas")
public class SalidaTourController {

    private final SalidaTourService salidaService;

    public SalidaTourController(SalidaTourService salidaService) {
        this.salidaService = salidaService;
    }

    @GetMapping("/tour/{tourId}")
    public ResponseEntity<List<SalidaTourResponse>> listarPorTour(
            @PathVariable Long tourId) {

        return ResponseEntity.ok(
                salidaService.listarPorTour(tourId)
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalidaTourResponse> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(salidaService.obtenerPorId(id));
    }

    @GetMapping("/admin/todas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SalidaTourResponse>> listarTodas() {

        return ResponseEntity.ok(salidaService.listarTodas());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalidaTourResponse> crear(
            @Valid @RequestBody SalidaTourRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(salidaService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SalidaTourResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody SalidaTourRequest request) {

        return ResponseEntity.ok(
                salidaService.actualizar(id, request)
        );
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> cancelar(
            @PathVariable Long id) {

        salidaService.cancelar(id);

        return ResponseEntity.noContent().build();
    }
}
