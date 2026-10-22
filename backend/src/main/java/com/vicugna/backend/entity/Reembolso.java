
package com.vicugna.backend.entity;

import com.vicugna.backend.enums.EstadoReembolso;
import com.vicugna.backend.enums.MetodoPago;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "reembolsos",
    indexes = {
        @Index(name = "idx_reembolso_pago", columnList = "pago_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Reembolso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pago_id", nullable = false)
    private Pago pago;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoReembolso estado = EstadoReembolso.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private MetodoPago metodoReembolso;

    @Column(length = 120)
    private String referenciaOperacion;

    @Column(nullable = false, length = 500)
    private String motivo;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaSolicitud;

    private LocalDateTime fechaResolucion;

    @Version
    private Long version;

    @PrePersist
    public void prePersist() {
        if (fechaSolicitud == null) {
            fechaSolicitud = LocalDateTime.now();
        }
        if (estado == null) {
            estado = EstadoReembolso.PENDIENTE;
        }
    }
}
