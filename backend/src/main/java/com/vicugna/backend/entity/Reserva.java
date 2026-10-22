package com.vicugna.backend.entity;

import com.vicugna.backend.enums.EstadoReserva;
import com.vicugna.backend.enums.OrigenReserva;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "reservas",
    indexes = {
        @Index(name = "idx_reserva_cliente", columnList = "cliente_id"),
        @Index(name = "idx_reserva_salida", columnList = "salida_tour_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 40)
    private String codigo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "salida_tour_id", nullable = false)
    private SalidaTour salidaTour;

    @Column(nullable = false)
    private Integer cantidadPersonas;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal precioUnitario;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montoTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoReserva estado = EstadoReserva.PENDIENTE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrigenReserva origen;

    @Column(length = 500)
    private String observaciones;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaReserva;

    @Version
    private Long version;

    @PrePersist
    public void prePersist() {
        if (fechaReserva == null) {
            fechaReserva = LocalDateTime.now();
        }
    }
}
