package com.vicugna.backend.service;

import com.vicugna.backend.dto.tour.TourRequest;
import com.vicugna.backend.dto.tour.TourResponse;

import java.util.List;

public interface TourService {

    TourResponse crear(TourRequest request);

    TourResponse actualizar(Long id, TourRequest request);

    TourResponse obtenerPorId(Long id);

    List<TourResponse> listarActivos();

    List<TourResponse> listarTodos();

    List<TourResponse> buscar(String texto);

    void desactivar(Long id);
}
