
package com.vicugna.backend.dto.reserva;

import com.vicugna.backend.enums.EstadoReserva;
import com.vicugna.backend.enums.OrigenReserva;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter
@Setter
public class ReservaResponse {

    private Long id;
    private String codigo;

    private Long clienteId;
    private String nombreCliente;

    private Long salidaTourId;
    private String nombreTour;

    private LocalDate fechaSalida;
    private LocalTime horaSalida;

    private Integer cantidadPersonas;

    private BigDecimal precioUnitario;
    private BigDecimal montoTotal;

    private EstadoReserva estado;
    private OrigenReserva origen;

    private String observaciones;
    private LocalDateTime fechaReserva;
}
