package com.vicugna.backend.dto.reserva;

import com.vicugna.backend.enums.OrigenReserva;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservaRequest {

    // Solo ADMIN puede indicar el cliente por ID.
    // Para reservas WEB, se identificará desde el JWT.
    private Long clienteId;

    @NotNull
    private Long salidaTourId;

    @NotNull
    @Min(1)
    private Integer cantidadPersonas;

    private OrigenReserva origen;

    @Size(max = 500)
    private String observaciones;
}
