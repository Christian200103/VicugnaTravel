
import api from "./api";

const config = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const adminSalidaService = {
  listarTodas: async (token) => {
    const response = await api.get(
      "/salidas/admin/todas",
      config(token)
    );
    return response.data;
  },

  crear: async (datos, token) => {
    const response = await api.post(
      "/salidas",
      datos,
      config(token)
    );
    return response.data;
  },

  actualizar: async (id, datos, token) => {
    const response = await api.put(
      `/salidas/${id}`,
      datos,
      config(token)
    );
    return response.data;
  },

  cancelar: async (id, token) => {
    const response = await api.patch(
      `/salidas/${id}/cancelar`,
      {},
      config(token)
    );
    return response.data;
  },
};

export default adminSalidaService;
