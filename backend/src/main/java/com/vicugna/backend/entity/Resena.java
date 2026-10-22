
package com.vicugna.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "resenas",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_resena_usuario_tour",
            columnNames = {"usuario_id", "tour_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Usuario que publica la reseña
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    // Tour que recibe la reseña
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tour_id", nullable = false)
    private Tour tour;

    // Calificacion de 1 a 5 estrellas
    @Column(nullable = false)
    private Integer calificacion;

    // Comentario del usuario
    @Column(nullable = false, length = 1000)
    private String comentario;

    // Fecha de publicacion
    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist
    public void prePersist() {
        if (fechaCreacion == null) {
            fechaCreacion = LocalDateTime.now();
        }
    }
}
