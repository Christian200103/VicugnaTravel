
package com.vicugna.backend.dto.pago;

import com.vicugna.backend.enums.MetodoPago;

import jakarta.validation.constraints.*;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PagoRequest {

    @NotNull(message = "La reserva es obligatoria")
    private Long reservaId;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(
        value = "0.01",
        message = "El monto debe ser mayor a cero"
    )
    @Digits(integer = 10, fraction = 2)
    private BigDecimal monto;

    @NotNull(message = "El método de pago es obligatorio")
    private MetodoPago metodoPago;

    @Size(max = 120)
    private String referenciaOperacion;

    @Size(max = 500)
    private String observaciones;
}
