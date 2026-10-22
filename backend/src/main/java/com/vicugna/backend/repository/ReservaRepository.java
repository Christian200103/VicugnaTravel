
package com.vicugna.backend.repository;

import com.vicugna.backend.entity.Reserva;
import com.vicugna.backend.enums.EstadoReserva;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    Optional<Reserva> findByCodigo(String codigo);

    List<Reserva> findByClienteId(Long clienteId);

    List<Reserva> findBySalidaTourId(Long salidaTourId);

    List<Reserva> findByEstado(EstadoReserva estado);
 // Contar reservas por estado
    long countByEstado(EstadoReserva estado);

    // Obtener las 5 reservas más recientes
    List<Reserva> findTop5ByOrderByFechaReservaDesc();

    boolean existsByCodigo(String codigo);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Reserva r WHERE r.id = :id")
    Optional<Reserva> findByIdForUpdate(@Param("id") Long id);
}
