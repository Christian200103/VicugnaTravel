package com.vicugna.backend.dto.cliente;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ClienteRequest {

    @Pattern(
        regexp = "^\\d{8}$",
        message = "El DNI debe contener 8 dígitos"
    )
    private String dni;

    @NotBlank(message = "Los nombres son obligatorios")
    @Size(max = 100)
    private String nombres;

    @NotBlank(message = "Los apellidos son obligatorios")
    @Size(max = 100)
    private String apellidos;

    @Pattern(
        regexp = "^\\d{9}$",
        message = "El teléfono debe contener 9 dígitos"
    )
    private String telefono;

    @Email(message = "Correo electrónico inválido")
    private String correo;
}
