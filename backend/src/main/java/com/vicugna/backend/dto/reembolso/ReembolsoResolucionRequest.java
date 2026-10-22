
package com.vicugna.backend.dto.reembolso;

import com.vicugna.backend.enums.MetodoPago;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReembolsoResolucionRequest {

    @NotNull
    private MetodoPago metodoReembolso;

    @Size(max = 120)
    private String referenciaOperacion;
}
