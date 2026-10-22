package com.vicugna.backend.mapper;

import com.vicugna.backend.dto.cliente.ClienteRequest;
import com.vicugna.backend.dto.cliente.ClienteResponse;
import com.vicugna.backend.entity.Cliente;

import org.springframework.stereotype.Component;

@Component
public class ClienteMapper {

    public ClienteResponse toResponse(Cliente cliente) {

        ClienteResponse response = new ClienteResponse();

        response.setId(cliente.getId());
        response.setDni(cliente.getDni());
        response.setNombres(cliente.getNombres());
        response.setApellidos(cliente.getApellidos());
        response.setTelefono(cliente.getTelefono());
        response.setCorreo(cliente.getCorreo());
        response.setTieneCuentaWeb(cliente.getUsuario() != null);

        return response;
    }

    public void actualizarEntidad(Cliente cliente, ClienteRequest request) {

        cliente.setDni(normalizar(request.getDni()));
        cliente.setNombres(request.getNombres().trim());
        cliente.setApellidos(request.getApellidos().trim());
        cliente.setTelefono(normalizar(request.getTelefono()));
        cliente.setCorreo(normalizarCorreo(request.getCorreo()));
    }

    private String normalizar(String valor) {
        return valor == null || valor.isBlank()
                ? null
                : valor.trim();
    }

    private String normalizarCorreo(String correo) {
        return correo == null || correo.isBlank()
                ? null
                : correo.trim().toLowerCase();
    }
}
