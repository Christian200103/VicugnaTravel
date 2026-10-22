
import api from "./api";

const dashboardService = {
  obtenerResumen: async (token) => {
    const response = await api.get("/dashboard/resumen", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  obtenerReservasRecientes: async (token) => {
    const response = await api.get(
      "/dashboard/reservas-recientes",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  },
};

export default dashboardService;
