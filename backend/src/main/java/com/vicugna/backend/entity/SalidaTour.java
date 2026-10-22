package com.vicugna.backend.entity;

import com.vicugna.backend.enums.EstadoSalida;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(
    name = "salidas_tour",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_salida_tour_fecha_hora",
        columnNames = {"tour_id", "fecha", "hora_salida"}
    )
)
@Getter
@Setter
@NoArgsConstructor
public class SalidaTour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_salida", nullable = false)
    private LocalTime horaSalida;

    @Column(nullable = false)
    private Integer cuposTotales;

    @Column(nullable = false)
    private Integer cuposDisponibles;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoSalida estado = EstadoSalida.PROGRAMADA;

    @Version
    private Long version;
}
