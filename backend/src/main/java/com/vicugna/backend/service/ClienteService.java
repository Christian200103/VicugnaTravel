
package com.vicugna.backend.service;

import com.vicugna.backend.dto.cliente.ClienteRequest;
import com.vicugna.backend.dto.cliente.ClienteResponse;

import java.util.List;

public interface ClienteService {

    ClienteResponse crear(ClienteRequest request);

    ClienteResponse actualizar(Long id, ClienteRequest request);

    ClienteResponse obtenerPorId(Long id);

    List<ClienteResponse> listarTodos();

    List<ClienteResponse> buscar(String texto);
}
