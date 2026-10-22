
package com.vicugna.backend.dto.perfil;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
public class CambiarPasswordRequest {

    @NotBlank(message = "La contraseña actual es obligatoria")
    private String passwordActual;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(
        min = 8,
        max = 72,
        message = "La nueva contraseña debe tener entre 8 y 72 caracteres"
    )
    private String passwordNueva;
}
