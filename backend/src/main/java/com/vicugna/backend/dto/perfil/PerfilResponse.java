
package com.vicugna.backend.dto.perfil;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class PerfilResponse {

    private Long id;

    private String nombres;

    private String apellidos;

    private String correo;

    private String rol;

    private String estado;

    private LocalDateTime fechaRegistro;
}
