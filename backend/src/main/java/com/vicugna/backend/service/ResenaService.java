
package com.vicugna.backend.service;

import com.vicugna.backend.dto.resena.ResenaRequest;
import com.vicugna.backend.dto.resena.ResenaResponse;

import java.util.List;

public interface ResenaService {

    // Registrar una reseña
    ResenaResponse crear(
            ResenaRequest request,
            String correoUsuario
    );

    // Consultar reseñas de un tour
    List<ResenaResponse> listarPorTour(Long tourId);

    // Consultar reseñas del usuario autenticado
    List<ResenaResponse> listarMisResenas(
            String correoUsuario
    );

    // Consultar todas las reseñas (ADMIN)
    List<ResenaResponse> listarTodas();

    // Obtener promedio de calificaciones
    Double obtenerPromedio(Long tourId);

    // Contar reseñas de un tour
    long contarPorTour(Long tourId);

    // Eliminar reseña (ADMIN)
    void eliminar(Long id);
}
