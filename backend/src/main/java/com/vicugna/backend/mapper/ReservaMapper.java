package com.vicugna.backend.mapper;

import com.vicugna.backend.dto.reserva.ReservaResponse;
import com.vicugna.backend.entity.Reserva;

import org.springframework.stereotype.Component;

@Component
public class ReservaMapper {

    public ReservaResponse toResponse(Reserva reserva) {

        ReservaResponse response = new ReservaResponse();

        response.setId(reserva.getId());
        response.setCodigo(reserva.getCodigo());

        response.setClienteId(reserva.getCliente().getId());
        response.setNombreCliente(
                reserva.getCliente().getNombres() + " " +
                reserva.getCliente().getApellidos()
        );

        response.setSalidaTourId(reserva.getSalidaTour().getId());
        response.setNombreTour(
                reserva.getSalidaTour().getTour().getNombre()
        );

        response.setFechaSalida(reserva.getSalidaTour().getFecha());
        response.setHoraSalida(reserva.getSalidaTour().getHoraSalida());

        response.setCantidadPersonas(reserva.getCantidadPersonas());
        response.setPrecioUnitario(reserva.getPrecioUnitario());
        response.setMontoTotal(reserva.getMontoTotal());

        response.setEstado(reserva.getEstado());
        response.setOrigen(reserva.getOrigen());

        response.setObservaciones(reserva.getObservaciones());
        response.setFechaReserva(reserva.getFechaReserva());

        return response;
    }
}
