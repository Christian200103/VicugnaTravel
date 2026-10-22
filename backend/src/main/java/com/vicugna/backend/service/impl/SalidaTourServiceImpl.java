
package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.tour.SalidaTourRequest;
import com.vicugna.backend.dto.tour.SalidaTourResponse;
import com.vicugna.backend.entity.SalidaTour;
import com.vicugna.backend.entity.Tour;
import com.vicugna.backend.enums.EstadoSalida;
import com.vicugna.backend.enums.EstadoTour;
import com.vicugna.backend.mapper.SalidaTourMapper;
import com.vicugna.backend.repository.SalidaTourRepository;
import com.vicugna.backend.repository.TourRepository;
import com.vicugna.backend.service.SalidaTourService;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SalidaTourServiceImpl implements SalidaTourService {

    private final SalidaTourRepository salidaRepository;
    private final TourRepository tourRepository;
    private final SalidaTourMapper mapper;

    public SalidaTourServiceImpl(
            SalidaTourRepository salidaRepository,
            TourRepository tourRepository,
            SalidaTourMapper mapper) {

        this.salidaRepository = salidaRepository;
        this.tourRepository = tourRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public SalidaTourResponse crear(SalidaTourRequest request) {

        validarFechaHora(request);

        Tour tour = buscarTourActivo(request.getTourId());

        if (salidaRepository.existsByTourIdAndFechaAndHoraSalida(
                tour.getId(), request.getFecha(), request.getHoraSalida())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe una salida para este tour en esa fecha y hora"
            );
        }

        SalidaTour salida = new SalidaTour();
        salida.setTour(tour);
        salida.setFecha(request.getFecha());
        salida.setHoraSalida(request.getHoraSalida());
        salida.setCuposTotales(request.getCuposTotales());
        salida.setCuposDisponibles(request.getCuposTotales());
        salida.setEstado(EstadoSalida.PROGRAMADA);

        try {
            return mapper.toResponse(salidaRepository.saveAndFlush(salida));
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La salida ya existe o incumple una restricción"
            );
        }
    }

    @Override
    @Transactional
    public SalidaTourResponse actualizar(
            Long id, SalidaTourRequest request) {

        validarFechaHora(request);

        SalidaTour salida = buscarEntidad(id);

        if (salida.getEstado() != EstadoSalida.PROGRAMADA) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Solo se pueden editar salidas programadas"
            );
        }

        Tour tour = buscarTourActivo(request.getTourId());

        if (!salida.getTour().getId().equals(tour.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No se puede cambiar el tour de una salida existente"
            );
        }

        int cuposOcupados =
                salida.getCuposTotales() - salida.getCuposDisponibles();

        if (request.getCuposTotales() < cuposOcupados) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La capacidad no puede ser menor a los cupos ocupados"
            );
        }

        if ((!salida.getFecha().equals(request.getFecha())
                || !salida.getHoraSalida().equals(request.getHoraSalida()))
                && salidaRepository.existsByTourIdAndFechaAndHoraSalida(
                    tour.getId(),
                    request.getFecha(),
                    request.getHoraSalida())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya existe otra salida con esa fecha y hora"
            );
        }

        salida.setFecha(request.getFecha());
        salida.setHoraSalida(request.getHoraSalida());
        salida.setCuposTotales(request.getCuposTotales());
        salida.setCuposDisponibles(
                request.getCuposTotales() - cuposOcupados
        );

        try {
            return mapper.toResponse(salidaRepository.saveAndFlush(salida));
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se pudo actualizar la salida"
            );
        }
    }

    @Override
    @Transactional(readOnly = true)
    public SalidaTourResponse obtenerPorId(Long id) {
        return mapper.toResponse(buscarEntidad(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalidaTourResponse> listarPorTour(Long tourId) {

        buscarTourActivo(tourId);

        return salidaRepository.findByTourId(tourId)
                .stream()
                .filter(s -> s.getEstado() == EstadoSalida.PROGRAMADA)
                .filter(s -> s.getCuposDisponibles() > 0)
                .filter(s -> !LocalDateTime.of(
                        s.getFecha(), s.getHoraSalida())
                        .isBefore(LocalDateTime.now()))
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SalidaTourResponse> listarTodas() {

        return salidaRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void cancelar(Long id) {

        SalidaTour salida = buscarEntidad(id);

        if (salida.getEstado() == EstadoSalida.FINALIZADA) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede cancelar una salida finalizada"
            );
        }

        int ocupados =
                salida.getCuposTotales() - salida.getCuposDisponibles();

        if (ocupados > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La salida tiene cupos ocupados; gestione primero las reservas"
            );
        }

        salida.setEstado(EstadoSalida.CANCELADA);
        salidaRepository.save(salida);
    }

    private SalidaTour buscarEntidad(Long id) {
        return salidaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Salida turística no encontrada"
                ));
    }

    private Tour buscarTourActivo(Long id) {
        Tour tour = tourRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tour no encontrado"
                ));

        if (tour.getEstado() != EstadoTour.ACTIVO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El tour está inactivo"
            );
        }

        return tour;
    }

    private void validarFechaHora(SalidaTourRequest request) {

        if (request.getFecha() == null || request.getHoraSalida() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Fecha y hora son obligatorias"
            );
        }

        if (!LocalDateTime.of(
                request.getFecha(), request.getHoraSalida())
                .isAfter(LocalDateTime.now())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La salida debe tener una fecha y hora futura"
            );
        }
    }
}
