package com.vicugna.backend.service;

import com.vicugna.backend.dto.reserva.ReservaRequest;
import com.vicugna.backend.dto.reserva.ReservaResponse;

import java.util.List;

public interface ReservaService {

    ReservaResponse crearComoAdmin(ReservaRequest request);

    ReservaResponse crearComoCliente(
            ReservaRequest request,
            String correoUsuario
    );

    ReservaResponse obtenerPorId(Long id);

    List<ReservaResponse> listarTodas();

    List<ReservaResponse> misReservas(String correoUsuario);

    ReservaResponse confirmar(Long id);

    ReservaResponse cancelar(Long id);
}