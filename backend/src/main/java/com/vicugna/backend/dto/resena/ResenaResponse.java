
package com.vicugna.backend.dto.resena;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class ResenaResponse {

    private Long id;

    private Long usuarioId;

    private String nombreUsuario;

    private Long tourId;

    private String nombreTour;

    private Integer calificacion;

    private String comentario;

    private LocalDateTime fechaCreacion;
}
