package com.vicugna.backend.dto.tour;

import com.vicugna.backend.enums.EstadoTour;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TourResponse {

    private Long id;
    private String nombre;
    private String destino;
    private String descripcion;
    private BigDecimal precio;
    private Integer duracionHoras;
    private String imagenUrl;
    private EstadoTour estado;
}
