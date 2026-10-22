
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Users,
  TicketCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import reservaService from "../services/reservaService";

function MisReservas() {
  const { usuario, accessToken, autenticado } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!autenticado || usuario?.rol !== "CLIENTE") {
      setCargando(false);
      return;
    }

    let activo = true;

    const cargarReservas = async () => {
      setCargando(true);
      setError("");

      try {
        const datos = await reservaService.misReservas(accessToken);

        if (activo) {
          setReservas(Array.isArray(datos) ? datos : []);
        }
      } catch (err) {
        console.error("Error al consultar reservas:", err);

        if (activo) {
          setError("No se pudieron cargar tus reservas.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarReservas();

    return () => {
      activo = false;
    };
  }, [accessToken, autenticado, usuario?.rol]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    const [anio, mes, dia] = fecha.split("-").map(Number);

    return new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(anio, mes - 1, dia)));
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(monto || 0));
  };

  const estiloEstado = (estado) => {
    switch (String(estado || "").toUpperCase()) {
      case "CONFIRMADA":
        return "bg-green-100 text-green-800";
      case "CANCELADA":
        return "bg-red-100 text-red-800";
      case "PENDIENTE":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (!autenticado) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-6 py-20 text-center">
        <TicketCheck size={52} className="mx-auto text-marca-oscuro" />

        <h1 className="mt-5 text-3xl font-bold">
          Mis reservas
        </h1>

        <p className="mt-3 text-slate-600">
          Inicia sesión para consultar tus reservas turísticas.
        </p>

        <Link
          to="/login"
          className="mt-6 inline-block rounded-xl bg-marca px-6 py-3 font-bold text-slate-900"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  if (usuario?.rol !== "CLIENTE") {
    return (
      <main className="mx-auto min-h-[60vh] max-w-4xl px-6 py-20 text-center">
        <AlertCircle size={48} className="mx-auto text-amber-600" />

        <h1 className="mt-5 text-2xl font-bold">
          Acceso no disponible
        </h1>

        <p className="mt-3 text-slate-600">
          Esta sección está disponible únicamente para clientes.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
            Mi cuenta
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Mis reservas
          </h1>

          <p className="mt-3 text-slate-600">
            Hola, {usuario?.nombres}. Aquí puedes consultar tus viajes registrados.
          </p>
        </div>

        {cargando ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-600">
            Consultando tus reservas...
          </div>
        ) : error ? (
          <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-white p-6">
            <AlertCircle className="text-red-600" />
            <p>{error}</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <TicketCheck
              size={48}
              className="mx-auto mb-4 text-marca-oscuro"
            />

            <h2 className="text-xl font-bold text-slate-900">
              Todavía no tienes reservas
            </h2>

            <p className="mt-3 text-slate-600">
              Explora nuestros destinos y reserva tu próxima aventura.
            </p>

            <Link
              to="/"
              className="mt-6 inline-block rounded-xl bg-marca px-6 py-3 font-bold text-slate-900"
            >
              Explorar tours
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {reservas.map((reserva) => (
              <article
                key={reserva.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-500">
                    Código: {reserva.codigo || reserva.id}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${estiloEstado(reserva.estado)}`}
                  >
                    {String(reserva.estado || "Sin estado").replaceAll("_", " ")}
                  </span>
                </div>

                <h2 className="mt-5 text-xl font-extrabold text-slate-900">
                  {reserva.nombreTour}
                </h2>

                <div className="mt-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="text-marca-oscuro" />
                    <div>
                      <p className="text-xs text-slate-500">
                        Fecha del viaje
                      </p>
                      <p className="font-semibold text-slate-900">
                        {formatearFecha(reserva.fechaSalida)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock3 className="text-marca-oscuro" />
                    <div>
                      <p className="text-xs text-slate-500">
                        Hora de salida
                      </p>
                      <p className="font-semibold text-slate-900">
                        {reserva.horaSalida?.slice(0, 5) || "Por confirmar"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Users className="text-marca-oscuro" />
                    <div>
                      <p className="text-xs text-slate-500">
                        Cantidad de personas
                      </p>
                      <p className="font-semibold text-slate-900">
                        {reserva.cantidadPersonas}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <span className="font-medium text-slate-600">
                    Monto total
                  </span>

                  <span className="text-2xl font-extrabold text-slate-900">
                    {formatearMonto(reserva.montoTotal)}
                  </span>
                </div>

                {reserva.observaciones && (
                  <p className="mt-4 text-sm text-slate-500">
                    <strong>Observaciones:</strong>{" "}
                    {reserva.observaciones}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default MisReservas;
