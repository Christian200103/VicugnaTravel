package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.tour.TourRequest;
import com.vicugna.backend.dto.tour.TourResponse;
import com.vicugna.backend.entity.Tour;
import com.vicugna.backend.enums.EstadoTour;
import com.vicugna.backend.mapper.TourMapper;
import com.vicugna.backend.repository.TourRepository;
import com.vicugna.backend.service.TourService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;
    private final TourMapper tourMapper;

    public TourServiceImpl(
            TourRepository tourRepository,
            TourMapper tourMapper) {

        this.tourRepository = tourRepository;
        this.tourMapper = tourMapper;
    }

    @Override
    @Transactional
    public TourResponse crear(TourRequest request) {

        Tour tour = new Tour();

        tourMapper.actualizarEntidad(tour, request);
        tour.setEstado(EstadoTour.ACTIVO);

        Tour guardado = tourRepository.save(tour);

        return tourMapper.toResponse(guardado);
    }

    @Override
    @Transactional
    public TourResponse actualizar(Long id, TourRequest request) {

        Tour tour = buscarEntidad(id);

        tourMapper.actualizarEntidad(tour, request);

        return tourMapper.toResponse(tourRepository.save(tour));
    }

    @Override
    @Transactional(readOnly = true)
    public TourResponse obtenerPorId(Long id) {

        Tour tour = buscarEntidad(id);

        if (tour.getEstado() != EstadoTour.ACTIVO) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Tour no disponible"
            );
        }

        return tourMapper.toResponse(tour);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourResponse> listarActivos() {

        return tourRepository.findByEstado(EstadoTour.ACTIVO)
                .stream()
                .map(tourMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourResponse> listarTodos() {

        return tourRepository.findAll()
                .stream()
                .map(tourMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TourResponse> buscar(String texto) {

        String filtro = texto == null ? "" : texto.trim();

        return tourRepository.findByEstado(EstadoTour.ACTIVO)
                .stream()
                .filter(tour ->
                    tour.getNombre().toLowerCase()
                            .contains(filtro.toLowerCase())
                    ||
                    tour.getDestino().toLowerCase()
                            .contains(filtro.toLowerCase())
                )
                .map(tourMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void desactivar(Long id) {

        Tour tour = buscarEntidad(id);

        tour.setEstado(EstadoTour.INACTIVO);

        tourRepository.save(tour);
    }

    private Tour buscarEntidad(Long id) {

        return tourRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tour no encontrado"
                ));
    }
}
