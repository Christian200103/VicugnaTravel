package com.vicugna.backend.dto.tour;

import com.vicugna.backend.enums.EstadoSalida;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class SalidaTourResponse {

    private Long id;
    private Long tourId;
    private String nombreTour;
    private LocalDate fecha;
    private LocalTime horaSalida;
    private Integer cuposTotales;
    private Integer cuposDisponibles;
    private EstadoSalida estado;
}
