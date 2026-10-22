
package com.vicugna.backend.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class DashboardReservaRecienteResponse {

    private Long id;
    private String codigo;
    private String nombreCliente;
    private String nombreTour;
    private Integer cantidadPersonas;
    private BigDecimal montoTotal;
    private String estado;
    private LocalDateTime fechaReserva;
}
