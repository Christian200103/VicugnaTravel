
package com.vicugna.backend.dto.dashboard;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
public class DashboardResponse {

    // Estadisticas de reservas
    private long totalReservas;
    private long reservasPendientes;
    private long reservasConfirmadas;
    private long reservasCanceladas;
    private long reservasCompletadas;

    // Estadisticas de clientes
    private long totalClientes;

    // Estadisticas de tours
    private long totalTours;
    private long toursActivos;

    // Estadisticas economicas
    private BigDecimal ingresosRegistrados;
}
