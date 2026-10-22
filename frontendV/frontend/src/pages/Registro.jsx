
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, AlertCircle } from "lucide-react";

import authService from "../services/authService";

function Registro() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombres: "",
    apellidos: "",
    correo: "",
    password: "",
  });

  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const actualizarCampo = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setError("");

    if (formulario.password.length < 8) {
      setError("La contraseña debe tener mínimo 8 caracteres.");
      return;
    }

    if (formulario.password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      await authService.registro({
        nombres: formulario.nombres.trim(),
        apellidos: formulario.apellidos.trim(),
        correo: formulario.correo.trim(),
        password: formulario.password,
      });

      navigate("/login", {
        replace: true,
        state: {
          mensaje: "Cuenta creada correctamente. Ahora puedes iniciar sesión.",
        },
      });
    } catch (err) {
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        "No se pudo completar el registro. Verifica tus datos.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  const campos = [
    { name: "nombres", label: "Nombres", type: "text" },
    { name: "apellidos", label: "Apellidos", type: "text" },
    { name: "correo", label: "Correo electrónico", type: "email" },
    { name: "password", label: "Contraseña", type: "password" },
  ];

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-7 text-center">
          <img
            src="/images/logo-vicugna.png"
            alt="VICUGNA TRAVEL"
            className="mx-auto mb-5 h-20 max-w-[240px] object-contain"
          />

          <h1 className="text-3xl font-extrabold text-slate-900">
            Crear una cuenta
          </h1>

          <p className="mt-3 text-slate-500">
            Regístrate para reservar tus próximas aventuras.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={manejarRegistro} className="space-y-4">
          {campos.map((campo) => (
            <div key={campo.name}>
              <label
                htmlFor={campo.name}
                className="mb-2 block font-semibold text-slate-700"
              >
                {campo.label}
              </label>

              <input
                id={campo.name}
                name={campo.name}
                type={campo.type}
                required
                minLength={campo.name === "password" ? 8 : undefined}
                autoComplete={
                  campo.name === "password"
                    ? "new-password"
                    : campo.name === "correo"
                      ? "email"
                      : "on"
                }
                value={formulario[campo.name]}
                onChange={actualizarCampo}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-marca"
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="confirmarPassword"
              className="mb-2 block font-semibold text-slate-700"
            >
              Confirmar contraseña
            </label>

            <input
              id="confirmarPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-marca"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-marca px-6 py-3.5 font-bold text-slate-900 transition hover:bg-marca-oscuro disabled:opacity-60"
          >
            <UserPlus size={20} />
            <span>
              {cargando ? "Registrando..." : "Crear cuenta"}
            </span>
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-slate-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="font-semibold text-marca-oscuro hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Registro;
