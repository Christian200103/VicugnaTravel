
import api from "./api";

const reservaService = {
  crearComoCliente: async (datosReserva, token) => {
    const response = await api.post(
      "/reservas/cliente",
      datosReserva,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  misReservas: async (token) => {
    const response = await api.get("/reservas/mis-reservas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  listarTodas: async (token) => {
    const response = await api.get("/reservas/admin/todas", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  confirmar: async (id, token) => {
    const response = await api.patch(
      `/reservas/admin/${id}/confirmar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },

  cancelar: async (id, token) => {
    const response = await api.patch(
      `/reservas/admin/${id}/cancelar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default reservaService;
