
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  LockKeyhole,
  Save,
  ShieldCheck,
  Eye,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import perfilService from "../services/perfilService";

function MiPerfil() {
  const navigate = useNavigate();

  const {
    accessToken,
    autenticado,
    cerrarSesionLocal,
  } = useAuth();

  const [perfil, setPerfil] = useState(null);
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");

  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [mostrarPasswords, setMostrarPasswords] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!autenticado || !accessToken) {
      setCargando(false);
      return;
    }

    let activo = true;

    const cargarPerfil = async () => {
      setCargando(true);

      try {
        const datos = await perfilService.obtenerMiPerfil(accessToken);

        if (activo) {
          setPerfil(datos);
          setNombres(datos.nombres ?? "");
          setApellidos(datos.apellidos ?? "");
        }
      } catch (err) {
        console.error(err);

        if (activo) {
          setError("No se pudo cargar tu perfil.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, [accessToken, autenticado]);

  const actualizarPerfil = async (evento) => {
    evento.preventDefault();

    if (!nombres.trim() || !apellidos.trim()) {
      setError("Los nombres y apellidos son obligatorios.");
      return;
    }

    if (nombres.trim().length > 100 || apellidos.trim().length > 100) {
      setError("Los nombres y apellidos no deben superar 100 caracteres.");
      return;
    }

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      const actualizado = await perfilService.actualizarMiPerfil(
        {
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
        },
        accessToken
      );

      setPerfil(actualizado);
      setNombres(actualizado.nombres ?? "");
      setApellidos(actualizado.apellidos ?? "");
      setMensaje("Tus datos personales se actualizaron correctamente.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "No se pudo actualizar el perfil."
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarPassword = async (evento) => {
    evento.preventDefault();

    if (passwordNueva.length < 8 || passwordNueva.length > 72) {
      setError("La nueva contraseña debe tener entre 8 y 72 caracteres.");
      return;
    }

    if (passwordNueva !== confirmarPassword) {
      setError("La confirmación no coincide con la nueva contraseña.");
      return;
    }

    setCambiandoPassword(true);
    setError("");
    setMensaje("");

    try {
      await perfilService.cambiarPassword(
        {
          passwordActual,
          passwordNueva,
        },
        accessToken
      );

      setPasswordActual("");
      setPasswordNueva("");
      setConfirmarPassword("");

      // Solicitar un nuevo inicio de sesión después del cambio.
      cerrarSesionLocal();
      navigate("/login", {
        replace: true,
        state: {
          aviso: "Contraseña actualizada. Inicia sesión nuevamente.",
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "No se pudo cambiar la contraseña. Verifica tu contraseña actual."
      );
    } finally {
      setCambiandoPassword(false);
    }
  };

  const formatearFecha = (valor) => {
    if (!valor) return "-";

    const fecha = new Date(valor);

    return Number.isNaN(fecha.getTime())
      ? valor
      : fecha.toLocaleDateString("es-PE");
  };

  if (!autenticado) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Mi perfil</h1>
        <p className="mt-3 text-slate-600">
          Inicia sesión para consultar tus datos personales.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-marca px-6 py-3 font-bold"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-9">
          <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
            VICUGNA TRAVEL
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">
            Mi perfil
          </h1>
          <p className="mt-2 text-slate-600">
            Consulta y administra la información de tu cuenta.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-700">
            {mensaje}
          </div>
        )}

        {cargando ? (
          <div className="rounded-2xl bg-white p-10 text-center">
            Cargando perfil...
          </div>
        ) : perfil ? (
          <div className="grid gap-7 lg:grid-cols-2">
            <section className="rounded-2xl border bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
                  <UserRound size={26} />
                </div>
                <h2 className="text-xl font-bold">
                  Datos personales
                </h2>
              </div>

              <form onSubmit={actualizarPerfil} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block font-semibold">Nombres</span>
                  <input
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    maxLength={100}
                    required
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-semibold">Apellidos</span>
                  <input
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    maxLength={100}
                    required
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-semibold">
                    Correo electrónico
                  </span>
                  <input
                    value={perfil.correo ?? ""}
                    disabled
                    className="w-full rounded-xl border bg-slate-100 px-4 py-3 text-slate-500"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Rol</p>
                    <p className="mt-1 font-bold">{perfil.rol}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Estado</p>
                    <p className="mt-1 font-bold">{perfil.estado}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-500">
                  Fecha de registro: {formatearFecha(perfil.fechaRegistro)}
                </p>

                <button
                  type="submit"
                  disabled={guardando}
                  className="flex items-center gap-2 rounded-xl bg-marca px-6 py-3 font-bold disabled:opacity-50"
                >
                  <Save size={18} />
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border bg-white p-7 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                  <LockKeyhole size={26} />
                </div>
                <h2 className="text-xl font-bold">
                  Seguridad de la cuenta
                </h2>
              </div>

              <form onSubmit={cambiarPassword} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block font-semibold">
                    Contraseña actual
                  </span>
                  <input
                    type={mostrarPasswords ? "text" : "password"}
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-semibold">
                    Nueva contraseña
                  </span>
                  <input
                    type={mostrarPasswords ? "text" : "password"}
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                    minLength={8}
                    maxLength={72}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block font-semibold">
                    Confirmar nueva contraseña
                  </span>
                  <input
                    type={mostrarPasswords ? "text" : "password"}
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </label>

                                    
                    <button
                    type="button"
                    onClick={() => setMostrarPasswords((valor) => !valor)}
                    className="flex items-center gap-2 text-sm font-semibold text-slate-600"
                    >
                    <Eye size={18} />
                    <span>
                        {mostrarPasswords
                        ? "Ocultar contraseñas"
                        : "Mostrar contraseñas"}
                    </span>
                    </button>


                <button
                  type="submit"
                  disabled={cambiandoPassword}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white disabled:opacity-50"
                >
                  <ShieldCheck size={18} />
                  {cambiandoPassword
                    ? "Actualizando..."
                    : "Cambiar contraseña"}
                </button>
              </form>
            </section>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center">
            No se pudo mostrar la información del perfil.
          </div>
        )}
      </div>
    </main>
  );
}

export default MiPerfil;
