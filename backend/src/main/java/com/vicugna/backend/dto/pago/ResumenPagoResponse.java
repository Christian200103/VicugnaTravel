
package com.vicugna.backend.dto.pago;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ResumenPagoResponse {

    private Long reservaId;
    private String codigoReserva;

    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private BigDecimal saldoPendiente;

    private String estadoFinanciero;
}
