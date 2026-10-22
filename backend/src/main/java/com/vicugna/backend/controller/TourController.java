package com.vicugna.backend.controller;

import com.vicugna.backend.dto.tour.TourRequest;
import com.vicugna.backend.dto.tour.TourResponse;
import com.vicugna.backend.service.TourService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    private final TourService tourService;

    public TourController(TourService tourService) {
        this.tourService = tourService;
    }

    @GetMapping
    public ResponseEntity<List<TourResponse>> listarActivos() {
        return ResponseEntity.ok(tourService.listarActivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TourResponse> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(tourService.obtenerPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<TourResponse>> buscar(
            @RequestParam String texto) {

        return ResponseEntity.ok(tourService.buscar(texto));
    }

    @GetMapping("/admin/todos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TourResponse>> listarTodos() {

        return ResponseEntity.ok(tourService.listarTodos());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourResponse> crear(
            @Valid @RequestBody TourRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tourService.crear(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TourResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody TourRequest request) {

        return ResponseEntity.ok(
                tourService.actualizar(id, request)
        );
    }

    @PatchMapping("/{id}/desactivar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> desactivar(
            @PathVariable Long id) {

        tourService.desactivar(id);

        return ResponseEntity.noContent().build();
    }
}
