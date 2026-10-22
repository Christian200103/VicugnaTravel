
import {
  createContext,
  useContext,
  useState,
} from "react";

import authService from "../services/authService";

const AuthContext = createContext(null);

const CLAVE_SESION = "vicugna_sesion";

function recuperarSesion() {
  try {
    const guardado = sessionStorage.getItem(CLAVE_SESION);

    if (!guardado) {
      return null;
    }

    const sesion = JSON.parse(guardado);

    if (
      !sesion?.accessToken ||
      !sesion?.usuario
    ) {
      sessionStorage.removeItem(CLAVE_SESION);
      return null;
    }

    return sesion;
  } catch {
    sessionStorage.removeItem(CLAVE_SESION);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(recuperarSesion);

  const usuario = sesion?.usuario ?? null;
  const accessToken = sesion?.accessToken ?? null;

  const iniciarSesion = async (correo, password) => {
    const datos = await authService.login(correo, password);

    if (!datos.accessToken) {
      throw new Error(
        "El servidor no devolvió un token de acceso."
      );
    }

    const nuevaSesion = {
      accessToken: datos.accessToken,
      usuario: {
        id: datos.usuarioId,
        nombres: datos.nombres,
        correo: datos.correo,
        rol: datos.rol,
      },
    };

    sessionStorage.setItem(
      CLAVE_SESION,
      JSON.stringify(nuevaSesion)
    );

    setSesion(nuevaSesion);

    return datos;
  };

  const cerrarSesionLocal = () => {
    sessionStorage.removeItem(CLAVE_SESION);
    setSesion(null);
  };

  const actualizarUsuarioLocal = (datosActualizados) => {
    setSesion((anterior) => {
      if (!anterior) {
        return anterior;
      }

      const nuevaSesion = {
        ...anterior,
        usuario: {
          ...anterior.usuario,
          ...datosActualizados,
        },
      };

      sessionStorage.setItem(
        CLAVE_SESION,
        JSON.stringify(nuevaSesion)
      );

      return nuevaSesion;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        accessToken,
        iniciarSesion,
        cerrarSesionLocal,
        actualizarUsuarioLocal,
        autenticado: Boolean(accessToken),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider."
    );
  }

  return contexto;
}
