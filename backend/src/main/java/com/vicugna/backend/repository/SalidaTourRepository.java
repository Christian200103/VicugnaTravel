package com.vicugna.backend.repository;

import com.vicugna.backend.entity.SalidaTour;
import com.vicugna.backend.enums.EstadoSalida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SalidaTourRepository

        extends JpaRepository<SalidaTour, Long> {

    List<SalidaTour> findByTourId(Long tourId);

    List<SalidaTour> findByFechaGreaterThanEqual(LocalDate fecha);

    List<SalidaTour> findByEstado(EstadoSalida estado);

    boolean existsByTourIdAndFechaAndHoraSalida(
            Long tourId,
            LocalDate fecha,
            LocalTime horaSalida
    );
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SalidaTour s WHERE s.id = :id")
    Optional<SalidaTour> findByIdForUpdate(@Param("id") Long id);
}
