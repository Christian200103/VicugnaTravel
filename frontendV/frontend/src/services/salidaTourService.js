
import api from "./api";

const salidaTourService = {
  listarPorTour: async (tourId) => {
    const response = await api.get(`/salidas/tour/${tourId}`);
    return response.data;
  },
};

export default salidaTourService;
