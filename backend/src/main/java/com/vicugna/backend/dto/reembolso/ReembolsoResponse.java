
package com.vicugna.backend.dto.reembolso;

import com.vicugna.backend.enums.EstadoReembolso;
import com.vicugna.backend.enums.MetodoPago;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ReembolsoResponse {

    private Long id;

    private Long pagoId;
    private Long reservaId;
    private String codigoReserva;

    private BigDecimal monto;
    private EstadoReembolso estado;

    private MetodoPago metodoReembolso;
    private String referenciaOperacion;
    private String motivo;

    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaResolucion;
}
