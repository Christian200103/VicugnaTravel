
package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.resena.ResenaRequest;
import com.vicugna.backend.dto.resena.ResenaResponse;

import com.vicugna.backend.entity.Resena;
import com.vicugna.backend.entity.Tour;
import com.vicugna.backend.entity.Usuario;

import com.vicugna.backend.enums.EstadoUsuario;

import com.vicugna.backend.mapper.ResenaMapper;

import com.vicugna.backend.repository.ResenaRepository;
import com.vicugna.backend.repository.TourRepository;
import com.vicugna.backend.repository.UsuarioRepository;

import com.vicugna.backend.service.ResenaService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ResenaServiceImpl implements ResenaService {

    private final ResenaRepository resenaRepository;
    private final UsuarioRepository usuarioRepository;
    private final TourRepository tourRepository;
    private final ResenaMapper resenaMapper;

    public ResenaServiceImpl(
            ResenaRepository resenaRepository,
            UsuarioRepository usuarioRepository,
            TourRepository tourRepository,
            ResenaMapper resenaMapper) {

        this.resenaRepository = resenaRepository;
        this.usuarioRepository = usuarioRepository;
        this.tourRepository = tourRepository;
        this.resenaMapper = resenaMapper;
    }

    // Registrar una nueva reseña
    @Override
    @Transactional
    public ResenaResponse crear(
            ResenaRequest request,
            String correoUsuario) {

        Usuario usuario = usuarioRepository
                .findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"
                ));

        // Verificar que la cuenta este activa
        if (usuario.getEstado() != EstadoUsuario.ACTIVO) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "La cuenta no esta activa"
            );
        }

        Tour tour = tourRepository.findById(
                request.getTourId()
        ).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Tour no encontrado"
        ));

        // Validar calificacion
        if (request.getCalificacion() == null
                || request.getCalificacion() < 1
                || request.getCalificacion() > 5) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La calificacion debe estar entre 1 y 5"
            );
        }

        // Validar comentario
        if (request.getComentario() == null
                || request.getComentario().isBlank()
                || request.getComentario().length() > 1000) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El comentario es obligatorio y debe tener hasta 1000 caracteres"
            );
        }

        // Una reseña por usuario y por tour
        if (resenaRepository.existsByUsuarioIdAndTourId(
                usuario.getId(),
                tour.getId())) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Ya registraste una reseña para este tour"
            );
        }

        Resena resena = new Resena();

        resena.setUsuario(usuario);
        resena.setTour(tour);
        resena.setCalificacion(request.getCalificacion());
        resena.setComentario(request.getComentario().trim());

        Resena guardada = resenaRepository.saveAndFlush(resena);

        return resenaMapper.toResponse(guardada);
    }

    // Listar reseñas de un tour
    @Override
    @Transactional(readOnly = true)
    public List<ResenaResponse> listarPorTour(Long tourId) {

        return resenaRepository
                .findByTourIdOrderByFechaCreacionDesc(tourId)
                .stream()
                .map(resenaMapper::toResponse)
                .toList();
    }

    // Listar mis reseñas
    @Override
    @Transactional(readOnly = true)
    public List<ResenaResponse> listarMisResenas(
            String correoUsuario) {

        Usuario usuario = usuarioRepository
                .findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Usuario no encontrado"
                ));

        return resenaRepository
                .findByUsuarioIdOrderByFechaCreacionDesc(
                        usuario.getId()
                )
                .stream()
                .map(resenaMapper::toResponse)
                .toList();
    }

    // Listar todas las reseñas
    @Override
    @Transactional(readOnly = true)
    public List<ResenaResponse> listarTodas() {

        return resenaRepository.findAll()
                .stream()
                .map(resenaMapper::toResponse)
                .toList();
    }

    // Promedio de calificaciones
    @Override
    @Transactional(readOnly = true)
    public Double obtenerPromedio(Long tourId) {

        Double promedio =
                resenaRepository.obtenerPromedioPorTour(tourId);

        return promedio != null ? promedio : 0.0;
    }

    // Cantidad de reseñas
    @Override
    @Transactional(readOnly = true)
    public long contarPorTour(Long tourId) {

        return resenaRepository.countByTourId(tourId);
    }

    // Eliminar una reseña
    @Override
    @Transactional
    public void eliminar(Long id) {

        Resena resena = resenaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reseña no encontrada"
                ));

        resenaRepository.delete(resena);
    }
}
