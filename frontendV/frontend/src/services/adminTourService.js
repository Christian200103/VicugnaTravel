
import api from "./api";

const configurarToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const adminTourService = {
  listarTodos: async (token) => {
    const response = await api.get(
      "/tours/admin/todos",
      configurarToken(token)
    );
    return response.data;
  },

  crear: async (datos, token) => {
    const response = await api.post(
      "/tours",
      datos,
      configurarToken(token)
    );
    return response.data;
  },

  actualizar: async (id, datos, token) => {
    const response = await api.put(
      `/tours/${id}`,
      datos,
      configurarToken(token)
    );
    return response.data;
  },

  desactivar: async (id, token) => {
    const response = await api.patch(
      `/tours/${id}/desactivar`,
      {},
      configurarToken(token)
    );
    return response.data;
  },
};

export default adminTourService;
