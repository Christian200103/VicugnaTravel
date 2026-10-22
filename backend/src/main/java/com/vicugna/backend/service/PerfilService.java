
package com.vicugna.backend.service;

import com.vicugna.backend.dto.perfil.PerfilResponse;
import com.vicugna.backend.dto.perfil.PerfilActualizarRequest;
import com.vicugna.backend.dto.perfil.CambiarPasswordRequest;

public interface PerfilService {

    PerfilResponse obtenerMiPerfil(String correoUsuario);

    PerfilResponse actualizarMiPerfil(
            String correoUsuario,
            PerfilActualizarRequest request
    );

    void cambiarPassword(
            String correoUsuario,
            CambiarPasswordRequest request
    );
}
