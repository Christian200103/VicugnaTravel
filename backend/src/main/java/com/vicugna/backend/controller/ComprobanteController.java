
package com.vicugna.backend.controller;

import com.vicugna.backend.service.ComprobanteService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
@RestController
@RequestMapping("/api/comprobantes")
public class ComprobanteController {

    private final ComprobanteService comprobanteService;

    public ComprobanteController(
            ComprobanteService comprobanteService) {

        this.comprobanteService = comprobanteService;
    }

    @GetMapping("/prueba")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<byte[]> descargarPdfPrueba() {

        byte[] pdf = comprobanteService.generarPdfPrueba();

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_PDF);

        headers.setContentDispositionFormData(
                "attachment",
                "comprobante-prueba.pdf"
        );

        return new ResponseEntity<>(
                pdf,
                headers,
                HttpStatus.OK
        );
    }

	@GetMapping("/reserva/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<byte[]> descargarComprobanteReserva(
	        @PathVariable Long id) {
	
	    byte[] pdf = comprobanteService.generarComprobanteReserva(id);
	
	    return ResponseEntity.ok()
	            .contentType(MediaType.APPLICATION_PDF)
	            .header(
	                    HttpHeaders.CONTENT_DISPOSITION,
	                    "attachment; filename=\"reserva-" + id + ".pdf\""
	            )
	            .body(pdf);
	}

}
