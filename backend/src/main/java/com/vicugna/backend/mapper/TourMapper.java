package com.vicugna.backend.mapper;

import com.vicugna.backend.dto.tour.TourRequest;
import com.vicugna.backend.dto.tour.TourResponse;
import com.vicugna.backend.entity.Tour;

import org.springframework.stereotype.Component;

@Component
public class TourMapper {

    public TourResponse toResponse(Tour tour) {

        TourResponse response = new TourResponse();

        response.setId(tour.getId());
        response.setNombre(tour.getNombre());
        response.setDestino(tour.getDestino());
        response.setDescripcion(tour.getDescripcion());
        response.setPrecio(tour.getPrecio());
        response.setDuracionHoras(tour.getDuracionHoras());
        response.setImagenUrl(tour.getImagenUrl());
        response.setEstado(tour.getEstado());

        return response;
    }

    public void actualizarEntidad(Tour tour, TourRequest request) {

        tour.setNombre(request.getNombre().trim());
        tour.setDestino(request.getDestino().trim());
        tour.setDescripcion(request.getDescripcion());
        tour.setPrecio(request.getPrecio());
        tour.setDuracionHoras(request.getDuracionHoras());
        tour.setImagenUrl(request.getImagenUrl());
    }
}
