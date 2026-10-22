package com.vicugna.backend.dto.tour;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class SalidaTourRequest {

    @NotNull
    private Long tourId;

    @NotNull
    @FutureOrPresent
    private LocalDate fecha;

    @NotNull
    private LocalTime horaSalida;

    @NotNull
    @Min(1)
    private Integer cuposTotales;
}
