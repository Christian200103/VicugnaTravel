
import api from "./api";

const configurarToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const pagoService = {
  registrar: async (datos, token) => {
    const response = await api.post(
      "/pagos",
      datos,
      configurarToken(token)
    );
    return response.data;
  },

  listarPorReserva: async (reservaId, token) => {
    const response = await api.get(
      `/pagos/reserva/${reservaId}`,
      configurarToken(token)
    );
    return response.data;
  },

  obtenerResumen: async (reservaId, token) => {
    const response = await api.get(
      `/pagos/reserva/${reservaId}/resumen`,
      configurarToken(token)
    );
    return response.data;
  },

  anular: async (pagoId, token) => {
    const response = await api.patch(
      `/pagos/${pagoId}/anular`,
      {},
      configurarToken(token)
    );
    return response.data;
  },
};

export default pagoService;
