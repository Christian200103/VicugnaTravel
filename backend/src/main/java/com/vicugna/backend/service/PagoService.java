
package com.vicugna.backend.service;

import com.vicugna.backend.dto.pago.PagoRequest;
import com.vicugna.backend.dto.pago.PagoResponse;
import com.vicugna.backend.dto.pago.ResumenPagoResponse;

import java.util.List;

public interface PagoService {

    PagoResponse registrar(PagoRequest request);

    List<PagoResponse> listarPorReserva(Long reservaId);

    ResumenPagoResponse obtenerResumen(Long reservaId);
    
    PagoResponse anular(Long pagoId);
}
