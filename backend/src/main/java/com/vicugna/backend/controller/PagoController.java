
package com.vicugna.backend.controller;

import com.vicugna.backend.dto.pago.PagoRequest;
import com.vicugna.backend.dto.pago.PagoResponse;
import com.vicugna.backend.dto.pago.ResumenPagoResponse;

import com.vicugna.backend.service.PagoService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
@PreAuthorize("hasRole('ADMIN')")
public class PagoController {

    private final PagoService pagoService;

    public PagoController(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    public ResponseEntity<PagoResponse> registrar(
            @Valid @RequestBody PagoRequest request) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(pagoService.registrar(request));
    }

    @GetMapping("/reserva/{reservaId}")
    public ResponseEntity<List<PagoResponse>> listarPorReserva(
            @PathVariable Long reservaId) {

        return ResponseEntity.ok(
                pagoService.listarPorReserva(reservaId)
        );
    }

    @GetMapping("/reserva/{reservaId}/resumen")
    public ResponseEntity<ResumenPagoResponse> obtenerResumen(
            @PathVariable Long reservaId) {

        return ResponseEntity.ok(
                pagoService.obtenerResumen(reservaId)
        );
    }

	@PatchMapping("/{id}/anular")
	public ResponseEntity<PagoResponse> anular(
	        @PathVariable Long id) {
	
	    return ResponseEntity.ok(pagoService.anular(id));
}

}
