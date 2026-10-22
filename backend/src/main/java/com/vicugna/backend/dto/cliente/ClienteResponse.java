package com.vicugna.backend.dto.cliente;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteResponse {

    private Long id;
    private String dni;
    private String nombres;
    private String apellidos;
    private String telefono;
    private String correo;
    private Boolean tieneCuentaWeb;
}
