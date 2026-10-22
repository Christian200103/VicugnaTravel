
package com.vicugna.backend.dto.resena;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class ResenaRequest {

    @NotNull(message = "El tour es obligatorio")
    private Long tourId;

    @NotNull(message = "La calificacion es obligatoria")
    @Min(value = 1, message = "La calificacion minima es 1")
    @Max(value = 5, message = "La calificacion maxima es 5")
    private Integer calificacion;

    @NotBlank(message = "El comentario es obligatorio")
    @Size(max = 1000, message = "El comentario no debe superar 1000 caracteres")
    private String comentario;
}
