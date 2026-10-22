package com.vicugna.backend.dto.tour;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TourRequest {

    @NotBlank
    private String nombre;

    @NotBlank
    private String destino;

    private String descripcion;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal precio;

    @NotNull
    @Min(1)
    private Integer duracionHoras;

    private String imagenUrl;
}
