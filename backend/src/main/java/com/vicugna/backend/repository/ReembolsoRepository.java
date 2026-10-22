
package com.vicugna.backend.repository;

import com.vicugna.backend.entity.Reembolso;
import com.vicugna.backend.enums.EstadoReembolso;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ReembolsoRepository
        extends JpaRepository<Reembolso, Long> {

    List<Reembolso> findByPagoIdOrderByFechaSolicitudDesc(Long pagoId);

    List<Reembolso> findByEstado(EstadoReembolso estado);

    @Query("""
        SELECT COALESCE(SUM(r.monto), 0)
        FROM Reembolso r
        WHERE r.pago.id = :pagoId
        AND r.estado IN :estados
    """)
    BigDecimal sumarPorPagoYEstados(
            @Param("pagoId") Long pagoId,
            @Param("estados") List<EstadoReembolso> estados
    );
}
