
package com.vicugna.backend.mapper;

import com.vicugna.backend.dto.reembolso.ReembolsoResponse;
import com.vicugna.backend.entity.Reembolso;

import org.springframework.stereotype.Component;

@Component
public class ReembolsoMapper {

    public ReembolsoResponse toResponse(Reembolso reembolso) {

        ReembolsoResponse response = new ReembolsoResponse();

        response.setId(reembolso.getId());

        response.setPagoId(reembolso.getPago().getId());
        response.setReservaId(
                reembolso.getPago().getReserva().getId()
        );
        response.setCodigoReserva(
                reembolso.getPago().getReserva().getCodigo()
        );

        response.setMonto(reembolso.getMonto());
        response.setEstado(reembolso.getEstado());

        response.setMetodoReembolso(reembolso.getMetodoReembolso());
        response.setReferenciaOperacion(reembolso.getReferenciaOperacion());
        response.setMotivo(reembolso.getMotivo());

        response.setFechaSolicitud(reembolso.getFechaSolicitud());
        response.setFechaResolucion(reembolso.getFechaResolucion());

        return response;
    }
}
