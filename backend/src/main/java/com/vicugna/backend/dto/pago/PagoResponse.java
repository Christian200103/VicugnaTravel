
package com.vicugna.backend.dto.pago;

import com.vicugna.backend.enums.EstadoPago;
import com.vicugna.backend.enums.MetodoPago;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PagoResponse {

    private Long id;

    private Long reservaId;
    private String codigoReserva;

    private BigDecimal monto;
    private MetodoPago metodoPago;
    private EstadoPago estado;

    private String referenciaOperacion;
    private String observaciones;

    private LocalDateTime fechaPago;
}
