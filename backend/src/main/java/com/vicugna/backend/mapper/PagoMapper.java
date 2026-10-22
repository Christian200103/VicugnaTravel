
package com.vicugna.backend.mapper;

import com.vicugna.backend.dto.pago.PagoResponse;
import com.vicugna.backend.entity.Pago;

import org.springframework.stereotype.Component;

@Component
public class PagoMapper {

    public PagoResponse toResponse(Pago pago) {

        PagoResponse response = new PagoResponse();

        response.setId(pago.getId());
        response.setReservaId(pago.getReserva().getId());
        response.setCodigoReserva(pago.getReserva().getCodigo());

        response.setMonto(pago.getMonto());
        response.setMetodoPago(pago.getMetodoPago());
        response.setEstado(pago.getEstado());

        response.setReferenciaOperacion(pago.getReferenciaOperacion());
        response.setObservaciones(pago.getObservaciones());
        response.setFechaPago(pago.getFechaPago());

        return response;
    }
}
