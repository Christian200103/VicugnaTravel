
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  LogIn,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { iniciarSesion } = useAuth();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const manejarLogin = async (e) => {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await iniciarSesion(correo.trim(), password);
      navigate("/", { replace: true });
    } catch (err) {
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        "No se pudo iniciar sesión. Verifica tu correo y contraseña.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <img
            src="/images/logo-vicugna.png"
            alt="VICUGNA TRAVEL"
            className="mx-auto mb-5 h-20 max-w-[240px] object-contain"
          />

          <h1 className="text-3xl font-extrabold text-slate-900">
            Iniciar sesión
          </h1>

          <p className="mt-3 text-slate-500">
            Accede a tu cuenta para gestionar tus reservas.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={manejarLogin} className="space-y-5">

          <div>
            <label
              htmlFor="correo"
              className="mb-2 block font-semibold text-slate-700"
            >
              Correo electrónico
            </label>

            <div className="relative">
              <Mail
                size={19}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                id="correo"
                type="email"
                required
                autoComplete="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-marca"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block font-semibold text-slate-700"
            >
              Contraseña
            </label>

            <div className="relative">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-3.5 text-slate-400"
              />

              <input
                id="password"
                type={mostrarPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-20 outline-none focus:border-marca"
              />

              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-4 top-3.5 text-sm font-semibold text-marca-oscuro"
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          
            <button
            type="submit"
            disabled={cargando}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-marca px-6 py-3.5 font-bold text-slate-900 transition hover:bg-marca-oscuro disabled:cursor-not-allowed disabled:opacity-60"
            >
            <LogIn size={20} />

            <span>
                {cargando ? "Ingresando..." : "Iniciar sesión"}
            </span>
            </button>

        </form>

        
            <p className="mt-7 text-center text-sm text-slate-600">
            ¿Todavía no tienes una cuenta?{" "}
            <Link
                to="/registro"
                className="font-semibold text-marca-oscuro hover:underline"
            >
                Regístrate aquí
            </Link>
            </p>

        <Link
          to="/"
          className="mt-5 block text-center text-sm font-medium text-slate-500 hover:text-marca-oscuro"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}

export default Login;
