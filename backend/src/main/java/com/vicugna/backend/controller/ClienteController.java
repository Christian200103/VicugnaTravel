
package com.vicugna.backend.controller;

import com.vicugna.backend.dto.cliente.ClienteRequest;
import com.vicugna.backend.dto.cliente.ClienteResponse;
import com.vicugna.backend.service.ClienteService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@PreAuthorize("hasRole('ADMIN')")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<ClienteResponse> crear(
            @Valid @RequestBody ClienteRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clienteService.crear(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponse> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ClienteRequest request) {

        return ResponseEntity.ok(clienteService.actualizar(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponse> obtenerPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(clienteService.obtenerPorId(id));
    }

    @GetMapping
    public ResponseEntity<List<ClienteResponse>> listarTodos() {

        return ResponseEntity.ok(clienteService.listarTodos());
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ClienteResponse>> buscar(
            @RequestParam String texto) {

        return ResponseEntity.ok(clienteService.buscar(texto));
    }
}
