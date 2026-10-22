
package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.dashboard.DashboardResponse;

import com.vicugna.backend.enums.EstadoPago;
import com.vicugna.backend.enums.EstadoReserva;
import com.vicugna.backend.enums.EstadoTour;

import com.vicugna.backend.repository.ClienteRepository;
import com.vicugna.backend.repository.PagoRepository;
import com.vicugna.backend.repository.ReservaRepository;
import com.vicugna.backend.repository.TourRepository;

import com.vicugna.backend.service.DashboardService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import com.vicugna.backend.dto.dashboard.DashboardReservaRecienteResponse;
import com.vicugna.backend.dto.reserva.ReservaResponse;
import com.vicugna.backend.mapper.ReservaMapper;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final ReservaRepository reservaRepository;
    private final ClienteRepository clienteRepository;
    private final TourRepository tourRepository;
    private final PagoRepository pagoRepository;
    private final ReservaMapper reservaMapper;
    

	public DashboardServiceImpl(
	        ReservaRepository reservaRepository,
	        ClienteRepository clienteRepository,
	        TourRepository tourRepository,
	        PagoRepository pagoRepository,
	        ReservaMapper reservaMapper) {
	
	    this.reservaRepository = reservaRepository;
	    this.clienteRepository = clienteRepository;
	    this.tourRepository = tourRepository;
	    this.pagoRepository = pagoRepository;
	    this.reservaMapper = reservaMapper;
	}


    @Override
    @Transactional(readOnly = true)
    public DashboardResponse obtenerResumen() {

        DashboardResponse response = new DashboardResponse();

        // Estadisticas de reservas
        response.setTotalReservas(
                reservaRepository.count()
        );

        response.setReservasPendientes(
                reservaRepository.countByEstado(
                        EstadoReserva.PENDIENTE
                )
        );

        response.setReservasConfirmadas(
                reservaRepository.countByEstado(
                        EstadoReserva.CONFIRMADA
                )
        );

        response.setReservasCanceladas(
                reservaRepository.countByEstado(
                        EstadoReserva.CANCELADA
                )
        );

        response.setReservasCompletadas(
                reservaRepository.countByEstado(
                        EstadoReserva.COMPLETADA
                )
        );

        // Estadisticas de clientes
        response.setTotalClientes(
                clienteRepository.count()
        );

        // Estadisticas de tours
        response.setTotalTours(
                tourRepository.count()
        );

        response.setToursActivos(
                tourRepository.countByEstado(
                        EstadoTour.ACTIVO
                )
        );

        // Ingresos registrados
        BigDecimal ingresos =
                pagoRepository.sumarIngresosPorEstado(
                        EstadoPago.REGISTRADO
                );

        response.setIngresosRegistrados(ingresos);

        return response;
    }

	@Override
	@Transactional(readOnly = true)
	public List<DashboardReservaRecienteResponse> obtenerReservasRecientes() {
	
	    return reservaRepository.findTop5ByOrderByFechaReservaDesc()
	            .stream()
	            .map(reserva -> {
	
	                ReservaResponse datos =
	                        reservaMapper.toResponse(reserva);
	
	                DashboardReservaRecienteResponse response =
	                        new DashboardReservaRecienteResponse();
	
	                response.setId(datos.getId());
	                response.setCodigo(datos.getCodigo());
	                response.setNombreCliente(datos.getNombreCliente());
	                response.setNombreTour(datos.getNombreTour());
	                response.setCantidadPersonas(datos.getCantidadPersonas());
	                response.setMontoTotal(datos.getMontoTotal());
	                response.setEstado(datos.getEstado().name());
	                response.setFechaReserva(datos.getFechaReserva());
	
	                return response;
	            })
	            .toList();
	}

}
