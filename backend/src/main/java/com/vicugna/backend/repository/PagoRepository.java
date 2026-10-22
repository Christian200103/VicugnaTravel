
package com.vicugna.backend.repository;

import com.vicugna.backend.entity.Pago;
import com.vicugna.backend.enums.EstadoPago;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;

import java.math.BigDecimal;
import java.util.List;

import java.util.Optional;
public interface PagoRepository extends JpaRepository<Pago, Long> {

    List<Pago> findByReservaIdOrderByFechaPagoDesc(Long reservaId);

    List<Pago> findByEstado(EstadoPago estado);

    @Query("""
        SELECT COALESCE(SUM(p.monto), 0)
        FROM Pago p
        WHERE p.reserva.id = :reservaId
        AND p.estado = :estado
    """)
    BigDecimal sumarPagosPorReservaYEstado(
            @Param("reservaId") Long reservaId,
            @Param("estado") EstadoPago estado
    );
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Pago p WHERE p.id = :id")
    Optional<Pago> findByIdForUpdate(@Param("id") Long id);

    // Sumar todos los pagos vigentes
    @Query("""
        SELECT COALESCE(SUM(p.monto), 0)
        FROM Pago p
        WHERE p.estado = :estado
    """)
    BigDecimal sumarIngresosPorEstado(
            @Param("estado") EstadoPago estado
    );

}
