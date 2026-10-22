
import api from "./api";

const configurarToken = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const perfilService = {
  obtenerMiPerfil: async (token) => {
    const response = await api.get(
      "/perfil/mi-perfil",
      configurarToken(token)
    );
    return response.data;
  },

  actualizarMiPerfil: async (datos, token) => {
    const response = await api.put(
      "/perfil/mi-perfil",
      datos,
      configurarToken(token)
    );
    return response.data;
  },

  cambiarPassword: async (datos, token) => {
    const response = await api.put(
      "/perfil/cambiar-password",
      datos,
      configurarToken(token)
    );
    return response.data;
  },
};

export default perfilService;
