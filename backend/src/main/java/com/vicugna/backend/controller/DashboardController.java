
package com.vicugna.backend.controller;

import com.vicugna.backend.dto.dashboard.DashboardResponse;
import com.vicugna.backend.service.DashboardService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.vicugna.backend.dto.dashboard.DashboardReservaRecienteResponse;
import java.util.List;


@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumen")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardResponse> obtenerResumen() {

        return ResponseEntity.ok(
                dashboardService.obtenerResumen()
        );
    }

	@GetMapping("/reservas-recientes")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<DashboardReservaRecienteResponse>>
	        obtenerReservasRecientes() {
	
	    return ResponseEntity.ok(
	            dashboardService.obtenerReservasRecientes()
	    );
	}

}
