
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Users,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import reservaService from "../services/reservaService";

function ReservaForm({ salida, onReservaCreada }) {
  const { usuario, accessToken, autenticado } = useAuth();

  const [cantidadPersonas, setCantidadPersonas] = useState(1);
  const [observaciones, setObservaciones] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [reservaCreada, setReservaCreada] = useState(false);

  const manejarReserva = async (e) => {
    e.preventDefault();
    setError("");

    if (!autenticado || !accessToken) {
      setError("Debes iniciar sesión para realizar una reserva.");
      return;
    }

    if (usuario?.rol !== "CLIENTE") {
      setError("Las reservas desde esta sección son para clientes.");
      return;
    }

    const cantidad = Number(cantidadPersonas);

    if (
      !Number.isInteger(cantidad) ||
      cantidad < 1 ||
      cantidad > Number(salida.cuposDisponibles)
    ) {
      setError("Selecciona una cantidad válida de personas.");
      return;
    }

    setCargando(true);

    try {
      await reservaService.crearComoCliente(
        {
          salidaTourId: salida.id,
          cantidadPersonas: cantidad,
          observaciones: observaciones.trim(),
        },
        accessToken
      );

      setReservaCreada(true);
      onReservaCreada?.();
    } catch (err) {
      const mensaje =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        "No se pudo registrar la reserva. Verifica los cupos disponibles.";

      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  if (reservaCreada) {
    return (
      <div
        role="status"
        className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-6"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 size={28} className="text-green-700" />

          <h3 className="text-xl font-bold text-green-900">
            ¡Reserva registrada correctamente!
          </h3>
        </div>

        <p className="mt-3 text-green-800">
          Tu reserva se ha registrado en el sistema de VICUGNA TRAVEL.
          Puedes consultar su estado desde tu cuenta cuando
          habilitemos la sección Mis reservas.
        </p>
      </div>
    );
  }

  if (!autenticado) {
    return (
      <div className="mt-6 rounded-2xl border border-amber-200 bg-white p-6">
        <h3 className="text-xl font-bold text-slate-900">
          Inicia sesión para reservar
        </h3>

        <p className="mt-2 text-slate-600">
          Necesitas una cuenta de cliente para confirmar esta salida.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-marca px-5 py-3 font-bold text-slate-900 hover:bg-marca-oscuro"
          >
            Iniciar sesión
          </Link>

          <Link
            to="/registro"
            className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Crear cuenta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <CalendarCheck className="text-marca-oscuro" size={28} />

        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Confirmar reserva
          </h3>

          <p className="text-sm text-slate-500">
            Cliente: {usuario?.nombres}
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={manejarReserva} className="space-y-5">
        <div>
          <label
            htmlFor="cantidadPersonas"
            className="mb-2 flex items-center gap-2 font-semibold text-slate-700"
          >
            <Users size={19} />
            Cantidad de personas
          </label>

          <input
            id="cantidadPersonas"
            type="number"
            min="1"
            max={salida.cuposDisponibles}
            step="1"
            required
            value={cantidadPersonas}
            onChange={(e) => setCantidadPersonas(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-marca"
          />

          <p className="mt-2 text-sm text-slate-500">
            Cupos disponibles: {salida.cuposDisponibles}
          </p>
        </div>

        <div>
          <label
            htmlFor="observaciones"
            className="mb-2 block font-semibold text-slate-700"
          >
            Observaciones (opcional)
          </label>

          <textarea
            id="observaciones"
            rows={3}
            maxLength={500}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="¿Tienes alguna indicación especial?"
            className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-marca"
          />
        </div>

        <button
          type="submit"
          disabled={cargando || usuario?.rol !== "CLIENTE"}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-marca px-6 py-3.5 font-bold text-slate-900 transition hover:bg-marca-oscuro disabled:cursor-not-allowed disabled:opacity-60"
        >
          <CalendarCheck size={20} />
          <span>
            {cargando ? "Registrando reserva..." : "Confirmar reserva"}
          </span>
        </button>

        {usuario?.rol !== "CLIENTE" && (
          <p className="text-sm text-amber-700">
            Esta opción está disponible únicamente para cuentas CLIENTE.
          </p>
        )}
      </form>
    </div>
  );
}

export default ReservaForm;
