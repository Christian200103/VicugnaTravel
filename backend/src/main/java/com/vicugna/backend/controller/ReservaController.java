
package com.vicugna.backend.controller;

import com.vicugna.backend.dto.reserva.ReservaRequest;
import com.vicugna.backend.dto.reserva.ReservaResponse;
import com.vicugna.backend.service.ReservaService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
public class ReservaController {

    private final ReservaService reservaService;

    public ReservaController(ReservaService reservaService) {
        this.reservaService = reservaService;
    }

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservaResponse> crearComoAdmin(
            @Valid @RequestBody ReservaRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservaService.crearComoAdmin(request));
    }

    @PostMapping("/cliente")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<ReservaResponse> crearComoCliente(
            @Valid @RequestBody ReservaRequest request,
            Authentication authentication) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservaService.crearComoCliente(
                        request,
                        authentication.getName()
                ));
    }

    @GetMapping("/mis-reservas")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<ReservaResponse>> misReservas(
            Authentication authentication) {

        return ResponseEntity.ok(
                reservaService.misReservas(authentication.getName())
        );
    }

    @GetMapping("/admin/todas")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReservaResponse>> listarTodas() {

        return ResponseEntity.ok(reservaService.listarTodas());
    }

    @GetMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservaResponse> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(reservaService.obtenerPorId(id));
    }

    @PatchMapping("/admin/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservaResponse> confirmar(
            @PathVariable Long id) {

        return ResponseEntity.ok(reservaService.confirmar(id));
    }

    @PatchMapping("/admin/{id}/cancelar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReservaResponse> cancelar(
            @PathVariable Long id) {

        return ResponseEntity.ok(reservaService.cancelar(id));
    }
}
