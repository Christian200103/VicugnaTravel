package com.vicugna.backend.repository;

import com.vicugna.backend.entity.Tour;
import com.vicugna.backend.enums.EstadoTour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TourRepository extends JpaRepository<Tour, Long> {

    List<Tour> findByEstado(EstadoTour estado);
 // Contar tours por estado
    long countByEstado(EstadoTour estado);

    List<Tour> findByNombreContainingIgnoreCase(String nombre);

    List<Tour> findByDestinoContainingIgnoreCase(String destino);
}
