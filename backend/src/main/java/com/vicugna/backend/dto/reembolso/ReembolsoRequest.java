
package com.vicugna.backend.dto.reembolso;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ReembolsoRequest {

    @NotNull
    private Long pagoId;

    @NotNull
    @DecimalMin("0.01")
    @Digits(integer = 10, fraction = 2)
    private BigDecimal monto;

    @NotBlank
    @Size(max = 500)
    private String motivo;
}
