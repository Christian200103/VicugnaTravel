
package com.vicugna.backend.service;

import com.vicugna.backend.entity.RefreshToken;
import com.vicugna.backend.entity.Usuario;

public interface RefreshTokenService {

    String crearToken(Usuario usuario);

    RefreshToken validarToken(String token);

    String rotarToken(RefreshToken tokenAnterior);

    void revocarToken(String token);
    void revocarTodosPorUsuario(Long usuarioId);
}
