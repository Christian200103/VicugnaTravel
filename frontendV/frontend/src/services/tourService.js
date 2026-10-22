
import api from "./api";

const tourService = {
  listarActivos: async () => {
    const response = await api.get("/tours");
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/tours/${id}`);
    return response.data;
  },

  buscar: async (texto) => {
    const response = await api.get("/tours/buscar", {
      params: { texto },
    });

    return response.data;
  },
};

export default tourService;
