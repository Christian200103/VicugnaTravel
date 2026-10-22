
package com.vicugna.backend.entity;

import com.vicugna.backend.enums.EstadoPago;
import com.vicugna.backend.enums.MetodoPago;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "pagos",
    indexes = {
        @Index(
            name = "idx_pago_reserva",
            columnList = "reserva_id"
        ),
        @Index(
            name = "idx_pago_fecha",
            columnList = "fecha_pago"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MetodoPago metodoPago;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoPago estado = EstadoPago.REGISTRADO;

    @Column(length = 120)
    private String referenciaOperacion;

    @Column(length = 500)
    private String observaciones;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaPago;

    @Version
    private Long version;

    @PrePersist
    public void prePersist() {

        if (fechaPago == null) {
            fechaPago = LocalDateTime.now();
        }

        if (estado == null) {
            estado = EstadoPago.REGISTRADO;
        }
    }
}
