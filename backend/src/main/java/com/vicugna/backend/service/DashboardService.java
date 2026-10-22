
package com.vicugna.backend.service;

import com.vicugna.backend.dto.dashboard.DashboardResponse;
import com.vicugna.backend.dto.dashboard.DashboardReservaRecienteResponse;

import java.util.List;

public interface DashboardService {

    DashboardResponse obtenerResumen();

    List<DashboardReservaRecienteResponse> obtenerReservasRecientes();
}
