
package com.vicugna.backend.mapper;

import com.vicugna.backend.dto.resena.ResenaResponse;
import com.vicugna.backend.entity.Resena;

import org.springframework.stereotype.Component;

@Component
public class ResenaMapper {

    public ResenaResponse toResponse(Resena resena) {

        ResenaResponse response = new ResenaResponse();

        response.setId(resena.getId());

        response.setUsuarioId(
                resena.getUsuario().getId()
        );

        response.setNombreUsuario(
                resena.getUsuario().getNombres() + " " +
                resena.getUsuario().getApellidos()
        );

        response.setTourId(
                resena.getTour().getId()
        );

        response.setNombreTour(
                resena.getTour().getNombre()
        );

        response.setCalificacion(
                resena.getCalificacion()
        );

        response.setComentario(
                resena.getComentario()
        );

        response.setFechaCreacion(
                resena.getFechaCreacion()
        );

        return response;
    }
}
