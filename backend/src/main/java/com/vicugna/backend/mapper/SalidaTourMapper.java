
package com.vicugna.backend.mapper;

import com.vicugna.backend.dto.tour.SalidaTourResponse;
import com.vicugna.backend.entity.SalidaTour;

import org.springframework.stereotype.Component;

@Component
public class SalidaTourMapper {

    public SalidaTourResponse toResponse(SalidaTour salida) {

        SalidaTourResponse response = new SalidaTourResponse();

        response.setId(salida.getId());
        response.setTourId(salida.getTour().getId());
        response.setNombreTour(salida.getTour().getNombre());
        response.setFecha(salida.getFecha());
        response.setHoraSalida(salida.getHoraSalida());
        response.setCuposTotales(salida.getCuposTotales());
        response.setCuposDisponibles(salida.getCuposDisponibles());
        response.setEstado(salida.getEstado());

        return response;
    }
}
