package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.reserva.ReservaRequest;
import com.vicugna.backend.dto.reserva.ReservaResponse;
import com.vicugna.backend.entity.*;
import com.vicugna.backend.enums.*;
import com.vicugna.backend.mapper.ReservaMapper;
import com.vicugna.backend.repository.*;
import com.vicugna.backend.service.ReservaService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.vicugna.backend.entity.Pago;
import com.vicugna.backend.enums.EstadoPago;
import com.vicugna.backend.repository.PagoRepository;

import java.math.BigDecimal;

@Service
public class ReservaServiceImpl implements ReservaService {

    private final ReservaRepository reservaRepository;
    private final SalidaTourRepository salidaRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReservaMapper mapper;
    private final PagoRepository pagoRepository;

	public ReservaServiceImpl(
	        ReservaRepository reservaRepository,
	        SalidaTourRepository salidaRepository,
	        ClienteRepository clienteRepository,
	        UsuarioRepository usuarioRepository,
	        ReservaMapper mapper,
	        PagoRepository pagoRepository) {
	
	    this.reservaRepository = reservaRepository;
	    this.salidaRepository = salidaRepository;
	    this.clienteRepository = clienteRepository;
	    this.usuarioRepository = usuarioRepository;
	    this.mapper = mapper;
	    this.pagoRepository = pagoRepository;
	}

    @Override
    @Transactional
    public ReservaResponse crearComoAdmin(ReservaRequest request) {

        if (request.getClienteId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe seleccionar un cliente"
            );
        }

        Cliente cliente = clienteRepository
                .findById(request.getClienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente no encontrado"
                ));

        OrigenReserva origen = request.getOrigen();

        if (origen == null || origen == OrigenReserva.WEB) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Seleccione PRESENCIAL, WHATSAPP o TELEFONO"
            );
        }

        return crearReserva(request, cliente, origen);
    }

    @Override
    @Transactional
    public ReservaResponse crearComoCliente(
            ReservaRequest request,
            String correoUsuario) {

        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado"
                ));

        Cliente cliente = clienteRepository
                .findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Perfil de cliente no encontrado"
                ));

        return crearReserva(request, cliente, OrigenReserva.WEB);
    }

    private ReservaResponse crearReserva(
            ReservaRequest request,
            Cliente cliente,
            OrigenReserva origen) {

        SalidaTour salida = salidaRepository
                .findByIdForUpdate(request.getSalidaTourId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Salida turística no encontrada"
                ));

        if (salida.getTour().getEstado() != EstadoTour.ACTIVO) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "El tour está inactivo"
            );
        }

        if (salida.getEstado() != EstadoSalida.PROGRAMADA) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La salida no está disponible"
            );
        }

        LocalDateTime fechaSalida = LocalDateTime.of(
                salida.getFecha(),
                salida.getHoraSalida()
        );

        if (!fechaSalida.isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La fecha de salida ya pasó"
            );
        }

        int cantidad = request.getCantidadPersonas();

        if (cantidad > salida.getCuposDisponibles()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No hay suficientes cupos disponibles"
            );
        }

        BigDecimal precioUnitario = salida.getTour().getPrecio();

        BigDecimal montoTotal = precioUnitario.multiply(
                BigDecimal.valueOf(cantidad)
        );

        Reserva reserva = new Reserva();

        reserva.setCodigo(
                "VIC-" + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase()
        );

        reserva.setCliente(cliente);
        reserva.setSalidaTour(salida);
        reserva.setCantidadPersonas(cantidad);
        reserva.setPrecioUnitario(precioUnitario);
        reserva.setMontoTotal(montoTotal);
        reserva.setEstado(EstadoReserva.PENDIENTE);
        reserva.setOrigen(origen);
        reserva.setObservaciones(request.getObservaciones());

        salida.setCuposDisponibles(
                salida.getCuposDisponibles() - cantidad
        );

        if (salida.getCuposDisponibles() == 0) {
            salida.setEstado(EstadoSalida.COMPLETA);
        }

        salidaRepository.save(salida);

        Reserva guardada = reservaRepository.save(reserva);

        return mapper.toResponse(guardada);
    }

    @Override
    @Transactional(readOnly = true)
    public ReservaResponse obtenerPorId(Long id) {
        return mapper.toResponse(buscarReserva(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponse> listarTodas() {
        return reservaRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReservaResponse> misReservas(String correoUsuario) {

        Usuario usuario = usuarioRepository.findByCorreo(correoUsuario)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado"
                ));

        Cliente cliente = clienteRepository
                .findByUsuarioId(usuario.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Perfil de cliente no encontrado"
                ));

        return reservaRepository.findByClienteId(cliente.getId())
                .stream()
                .map(mapper::toResponse)
                .toList();
    }


	@Override
	@Transactional
	public ReservaResponse confirmar(Long id) {
	
	    Reserva reserva = reservaRepository.findByIdForUpdate(id)
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND,
	                    "Reserva no encontrada"
	            ));
	
	    if (reserva.getEstado() != EstadoReserva.PENDIENTE) {
	        throw new ResponseStatusException(
	                HttpStatus.CONFLICT,
	                "Solo se pueden confirmar reservas pendientes"
	        );
	    }
	
	    LocalDateTime fechaSalida = LocalDateTime.of(
	            reserva.getSalidaTour().getFecha(),
	            reserva.getSalidaTour().getHoraSalida()
	    );
	
	    if (!fechaSalida.isAfter(LocalDateTime.now())) {
	        throw new ResponseStatusException(
	                HttpStatus.CONFLICT,
	                "No se puede confirmar una reserva de una salida pasada"
	        );
	    }
	
	    reserva.setEstado(EstadoReserva.CONFIRMADA);
	
	    return mapper.toResponse(reservaRepository.save(reserva));
	}



	@Override
	@Transactional
	public ReservaResponse cancelar(Long id) {
	
	    // Primero bloqueamos la reserva.
	    Reserva reserva = reservaRepository.findByIdForUpdate(id)
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND,
	                    "Reserva no encontrada"
	            ));
	
	    if (reserva.getEstado() != EstadoReserva.PENDIENTE
	            && reserva.getEstado() != EstadoReserva.CONFIRMADA) {
	
	        throw new ResponseStatusException(
	                HttpStatus.CONFLICT,
	                "Esta reserva no puede cancelarse"
	        );
	    }

		BigDecimal montoPagado =
		        pagoRepository.sumarPagosPorReservaYEstado(
		                reserva.getId(),
		                EstadoPago.REGISTRADO
		        );
		
		if (montoPagado.compareTo(BigDecimal.ZERO) > 0) {
		    throw new ResponseStatusException(
		            HttpStatus.CONFLICT,
		            "La reserva tiene pagos registrados. " +
		            "Debe gestionar los pagos antes de cancelar."
		    );
		}

	
	    // Después bloqueamos la salida para proteger sus cupos.
	    SalidaTour salida = salidaRepository
	            .findByIdForUpdate(reserva.getSalidaTour().getId())
	            .orElseThrow(() -> new ResponseStatusException(
	                    HttpStatus.NOT_FOUND,
	                    "Salida turística no encontrada"
	            ));
	
	    LocalDateTime fechaSalida = LocalDateTime.of(
	            salida.getFecha(),
	            salida.getHoraSalida()
	    );
	
	    if (!fechaSalida.isAfter(LocalDateTime.now())) {
	        throw new ResponseStatusException(
	                HttpStatus.CONFLICT,
	                "No se puede cancelar una reserva después de la salida"
	        );
	    }
	
	    if (salida.getEstado() == EstadoSalida.CANCELADA
	            || salida.getEstado() == EstadoSalida.FINALIZADA) {
	
	        throw new ResponseStatusException(
	                HttpStatus.CONFLICT,
	                "La salida ya no admite modificaciones"
	        );
	    }
	
	    int cuposRestaurados = salida.getCuposDisponibles()
	            + reserva.getCantidadPersonas();
	
	    if (cuposRestaurados > salida.getCuposTotales()) {
	        throw new ResponseStatusException(
	                HttpStatus.CONFLICT,
	                "La devolución de cupos supera la capacidad total"
	        );
	    }
	
	    reserva.setEstado(EstadoReserva.CANCELADA);
	    salida.setCuposDisponibles(cuposRestaurados);
	
	    if (salida.getEstado() == EstadoSalida.COMPLETA) {
	        salida.setEstado(EstadoSalida.PROGRAMADA);
	    }
	
	    salidaRepository.save(salida);
	    Reserva guardada = reservaRepository.save(reserva);
	
	    return mapper.toResponse(guardada);
	}


    private Reserva buscarReserva(Long id) {
        return reservaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"
                ));
    }
}
