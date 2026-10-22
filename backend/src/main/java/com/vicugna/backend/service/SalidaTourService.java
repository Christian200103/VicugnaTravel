
package com.vicugna.backend.service;

import com.vicugna.backend.dto.tour.SalidaTourRequest;
import com.vicugna.backend.dto.tour.SalidaTourResponse;

import java.util.List;

public interface SalidaTourService {

    SalidaTourResponse crear(SalidaTourRequest request);

    SalidaTourResponse actualizar(Long id, SalidaTourRequest request);

    SalidaTourResponse obtenerPorId(Long id);

    List<SalidaTourResponse> listarPorTour(Long tourId);

    List<SalidaTourResponse> listarTodas();

    void cancelar(Long id);
}
