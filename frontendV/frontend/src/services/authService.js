
import api from "./api";

const authService = {
  login: async (correo, password) => {
    const response = await api.post("/auth/login", {
      correo,
      password,
    });

    return response.data;
  },

  registro: async (datos) => {
    const response = await api.post("/auth/registro", datos);
    return response.data;
  },
};

export default authService;
