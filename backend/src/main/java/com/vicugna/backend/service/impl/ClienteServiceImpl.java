
package com.vicugna.backend.service.impl;

import com.vicugna.backend.dto.cliente.ClienteRequest;
import com.vicugna.backend.dto.cliente.ClienteResponse;
import com.vicugna.backend.entity.Cliente;
import com.vicugna.backend.mapper.ClienteMapper;
import com.vicugna.backend.repository.ClienteRepository;
import com.vicugna.backend.service.ClienteService;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper mapper;

    public ClienteServiceImpl(
            ClienteRepository clienteRepository,
            ClienteMapper mapper) {

        this.clienteRepository = clienteRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public ClienteResponse crear(ClienteRequest request) {

        validarDuplicados(request, null);

        Cliente cliente = new Cliente();
        mapper.actualizarEntidad(cliente, request);

        return mapper.toResponse(clienteRepository.save(cliente));
    }

    @Override
    @Transactional
    public ClienteResponse actualizar(Long id, ClienteRequest request) {

        Cliente cliente = buscarEntidad(id);

        validarDuplicados(request, id);

        if (cliente.getUsuario() != null) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Los clientes con cuenta web deben actualizar sus datos desde su perfil"
            );
        }

        mapper.actualizarEntidad(cliente, request);

        return mapper.toResponse(clienteRepository.save(cliente));
    }

    @Override
    @Transactional(readOnly = true)
    public ClienteResponse obtenerPorId(Long id) {
        return mapper.toResponse(buscarEntidad(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> listarTodos() {
        return clienteRepository.findAll()
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClienteResponse> buscar(String texto) {

        String filtro = texto == null
                ? ""
                : texto.trim().toLowerCase();

        return clienteRepository.findAll()
                .stream()
                .filter(cliente ->
                    cliente.getNombres().toLowerCase().contains(filtro)
                    || cliente.getApellidos().toLowerCase().contains(filtro)
                    || (cliente.getDni() != null
                        && cliente.getDni().contains(filtro))
                )
                .map(mapper::toResponse)
                .toList();
    }

    private void validarDuplicados(ClienteRequest request, Long idActual) {

        if (request.getDni() != null && !request.getDni().isBlank()) {

            clienteRepository.findByDni(request.getDni().trim())
                    .ifPresent(cliente -> {
                        if (!cliente.getId().equals(idActual)) {
                            throw new ResponseStatusException(
                                    HttpStatus.CONFLICT,
                                    "Ya existe un cliente con ese DNI"
                            );
                        }
                    });
        }

        if (request.getCorreo() != null && !request.getCorreo().isBlank()) {

            clienteRepository.findByCorreoIgnoreCase(request.getCorreo().trim())
                    .ifPresent(cliente -> {
                        if (!cliente.getId().equals(idActual)) {
                            throw new ResponseStatusException(
                                    HttpStatus.CONFLICT,
                                    "Ya existe un cliente con ese correo"
                            );
                        }
                    });
        }
    }

    private Cliente buscarEntidad(Long id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Cliente no encontrado"
                ));
    }
}
