
package com.vicugna.backend.repository;

import com.vicugna.backend.entity.Resena;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResenaRepository
        extends JpaRepository<Resena, Long> {

    // Consultar reseñas de un tour
    List<Resena> findByTourIdOrderByFechaCreacionDesc(
            Long tourId
    );

    // Verificar si el usuario ya califico ese tour
    boolean existsByUsuarioIdAndTourId(
            Long usuarioId,
            Long tourId
    );

    // Consultar reseñas de un usuario
    List<Resena> findByUsuarioIdOrderByFechaCreacionDesc(
            Long usuarioId
    );

    // Obtener promedio de calificaciones
    @Query("""
        SELECT AVG(r.calificacion)
        FROM Resena r
        WHERE r.tour.id = :tourId
    """)
    Double obtenerPromedioPorTour(
            @Param("tourId") Long tourId
    );

    // Contar reseñas de un tour
    long countByTourId(Long tourId);
}
