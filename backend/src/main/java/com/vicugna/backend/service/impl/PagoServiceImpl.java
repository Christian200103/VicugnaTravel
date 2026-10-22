
package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.pago.PagoRequest;
import com.vicugna.backend.dto.pago.PagoResponse;
import com.vicugna.backend.dto.pago.ResumenPagoResponse;

import com.vicugna.backend.entity.Pago;
import com.vicugna.backend.entity.Reserva;

import com.vicugna.backend.enums.EstadoPago;
import com.vicugna.backend.enums.EstadoReserva;
import com.vicugna.backend.enums.MetodoPago;

import com.vicugna.backend.mapper.PagoMapper;
import com.vicugna.backend.repository.PagoRepository;
import com.vicugna.backend.repository.ReservaRepository;
import com.vicugna.backend.service.PagoService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PagoServiceImpl implements PagoService {

    private final PagoRepository pagoRepository;
    private final ReservaRepository reservaRepository;
    private final PagoMapper mapper;

    public PagoServiceImpl(
            PagoRepository pagoRepository,
            ReservaRepository reservaRepository,
            PagoMapper mapper) {

        this.pagoRepository = pagoRepository;
        this.reservaRepository = reservaRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public PagoResponse registrar(PagoRequest request) {

        // Bloqueamos la reserva para evitar pagos simultáneos
        // que superen el importe total.
        Reserva reserva = reservaRepository
                .findByIdForUpdate(request.getReservaId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"
                ));

        if (reserva.getEstado() == EstadoReserva.CANCELADA
                || reserva.getEstado() == EstadoReserva.COMPLETADA) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se pueden registrar pagos para esta reserva"
            );
        }

        // Solo se registran pagos recibidos y verificados
        // manualmente por el administrador.
        if (request.getMetodoPago() == MetodoPago.PASARELA_ONLINE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Los pagos online requieren una pasarela verificada"
            );
        }

        BigDecimal totalPagado =
                pagoRepository.sumarPagosPorReservaYEstado(
                        reserva.getId(),
                        EstadoPago.REGISTRADO
                );

        BigDecimal saldoPendiente =
                reserva.getMontoTotal().subtract(totalPagado);

        if (request.getMonto().compareTo(saldoPendiente) > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El pago supera el saldo pendiente"
            );
        }

        Pago pago = new Pago();

        pago.setReserva(reserva);
        pago.setMonto(request.getMonto());
        pago.setMetodoPago(request.getMetodoPago());
        pago.setEstado(EstadoPago.REGISTRADO);

        pago.setReferenciaOperacion(request.getReferenciaOperacion());
        pago.setObservaciones(request.getObservaciones());

        Pago guardado = pagoRepository.saveAndFlush(pago);

        return mapper.toResponse(guardado);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PagoResponse> listarPorReserva(Long reservaId) {

        verificarReserva(reservaId);

        return pagoRepository
                .findByReservaIdOrderByFechaPagoDesc(reservaId)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ResumenPagoResponse obtenerResumen(Long reservaId) {

        Reserva reserva = verificarReserva(reservaId);

        BigDecimal montoPagado =
                pagoRepository.sumarPagosPorReservaYEstado(
                        reservaId,
                        EstadoPago.REGISTRADO
                );

        BigDecimal saldoPendiente =
                reserva.getMontoTotal().subtract(montoPagado);

        ResumenPagoResponse response = new ResumenPagoResponse();

        response.setReservaId(reserva.getId());
        response.setCodigoReserva(reserva.getCodigo());
        response.setMontoTotal(reserva.getMontoTotal());
        response.setMontoPagado(montoPagado);
        response.setSaldoPendiente(saldoPendiente);

        if (montoPagado.compareTo(BigDecimal.ZERO) == 0) {
            response.setEstadoFinanciero("PENDIENTE");
        } else if (saldoPendiente.compareTo(BigDecimal.ZERO) == 0) {
            response.setEstadoFinanciero("PAGADO");
        } else {
            response.setEstadoFinanciero("PARCIAL");
        }

        return response;
    }

    private Reserva verificarReserva(Long id) {

        return reservaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"
                ));
    }

@Override
@Transactional
public PagoResponse anular(Long pagoId) {

    Pago pago = pagoRepository.findById(pagoId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Pago no encontrado"
            ));

    // Mantener el mismo orden de bloqueo que el registro de pagos:
    // primero reserva, después pago.
    Reserva reserva = reservaRepository
            .findByIdForUpdate(pago.getReserva().getId())
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Reserva no encontrada"
            ));

    Pago pagoBloqueado = pagoRepository.findByIdForUpdate(pagoId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Pago no encontrado"
            ));

    if (!pagoBloqueado.getReserva().getId().equals(reserva.getId())) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "El pago no corresponde a la reserva"
        );
    }

    if (pagoBloqueado.getEstado() != EstadoPago.REGISTRADO) {
        throw new ResponseStatusException(
                HttpStatus.CONFLICT,
                "Solo se pueden anular pagos registrados"
        );
    }

    pagoBloqueado.setEstado(EstadoPago.ANULADO);

    return mapper.toResponse(pagoRepository.save(pagoBloqueado));
}

}
