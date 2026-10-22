
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  ClipboardCheck,
  Users,
  Map,
  MapPin,
  Wallet,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import dashboardService from "../services/dashboardService";

const indicadores = [
  {
    campo: "totalReservas",
    titulo: "Total de reservas",
    Icono: CalendarCheck,
    color: "bg-blue-50 text-blue-700",
  },
  {
    campo: "reservasPendientes",
    titulo: "Reservas pendientes",
    Icono: Clock3,
    color: "bg-amber-50 text-amber-700",
  },
  {
    campo: "reservasConfirmadas",
    titulo: "Reservas confirmadas",
    Icono: CheckCircle2,
    color: "bg-green-50 text-green-700",
  },
  {
    campo: "reservasCanceladas",
    titulo: "Reservas canceladas",
    Icono: XCircle,
    color: "bg-red-50 text-red-700",
  },
  {
    campo: "reservasCompletadas",
    titulo: "Reservas completadas",
    Icono: ClipboardCheck,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    campo: "totalClientes",
    titulo: "Clientes registrados",
    Icono: Users,
    color: "bg-purple-50 text-purple-700",
  },
  {
    campo: "totalTours",
    titulo: "Total de tours",
    Icono: Map,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    campo: "toursActivos",
    titulo: "Tours activos",
    Icono: MapPin,
    color: "bg-teal-50 text-teal-700",
  },
];

function AdminDashboard() {
  const { usuario, accessToken, autenticado } = useAuth();

  const [resumen, setResumen] = useState(null);
  const [reservasRecientes, setReservasRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [recarga, setRecarga] = useState(0);

  const esAdmin = autenticado && usuario?.rol === "ADMIN";

  useEffect(() => {
    if (!esAdmin || !accessToken) {
      return;
    }

    let activo = true;

    const cargarDashboard = async () => {
      setCargando(true);
      setError("");

      try {
        const [datosResumen, datosReservas] = await Promise.all([
          dashboardService.obtenerResumen(accessToken),
          dashboardService.obtenerReservasRecientes(accessToken),
        ]);

        if (activo) {
          setResumen(datosResumen);
          setReservasRecientes(
            Array.isArray(datosReservas) ? datosReservas : []
          );
        }
      } catch (err) {
        console.error("Error al cargar dashboard:", err);

        if (activo) {
          setError("No se pudieron cargar los indicadores del dashboard.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarDashboard();

    return () => {
      activo = false;
    };
  }, [accessToken, esAdmin, recarga]);

  const formatearMonto = (valor) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(valor || 0));

  const formatearFecha = (valor) => {
    if (!valor) return "Sin fecha";

    const fecha = new Date(valor);

    if (Number.isNaN(fecha.getTime())) return valor;

    return new Intl.DateTimeFormat("es-PE", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(fecha);
  };

  const estiloEstado = (estado) => {
    switch (estado) {
      case "PENDIENTE":
        return "bg-amber-100 text-amber-800";
      case "CONFIRMADA":
        return "bg-green-100 text-green-800";
      case "CANCELADA":
        return "bg-red-100 text-red-800";
      case "COMPLETADA":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (!autenticado) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Dashboard administrativo</h1>
        <p className="mt-3 text-slate-600">
          Inicia sesión como administrador para continuar.
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

  if (!esAdmin) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-6 py-20 text-center">
        <AlertCircle size={48} className="mx-auto text-red-600" />
        <h1 className="mt-4 text-2xl font-bold">Acceso restringido</h1>
        <p className="mt-3 text-slate-600">
          Esta sección es exclusiva del administrador.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
              VICUGNA TRAVEL
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Dashboard administrativo
            </h1>
            <p className="mt-3 text-slate-600">
              Resumen de la actividad de la agencia turística.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setRecarga((anterior) => anterior + 1)}
            disabled={cargando}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={18} />
            Actualizar datos
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {cargando ? (
          <div className="rounded-2xl bg-white p-12 text-center text-slate-600">
            Cargando indicadores...
          </div>
        ) : resumen ? (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {indicadores.map(({ campo, titulo, Icono, color }) => (
                <article
                  key={campo}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className={`inline-flex rounded-xl p-3 ${color}`}>
                    <Icono size={25} />
                  </div>

                  <p className="mt-5 text-sm font-semibold text-slate-500">
                    {titulo}
                  </p>

                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {resumen[campo] ?? 0}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-7">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-white p-3 text-amber-700">
                  <Wallet size={28} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Ingresos registrados
                  </p>

                  <p className="mt-1 text-3xl font-extrabold text-slate-900">
                    {formatearMonto(resumen.ingresosRegistrados)}
                  </p>
                </div>
              </div>
            </div>

            <section className="mt-12">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    Reservas recientes
                  </h2>

                  <p className="mt-2 text-slate-600">
                    Últimos movimientos registrados en el sistema.
                  </p>
                </div>

                <Link
                  to="/admin/reservas"
                  className="rounded-xl bg-marca px-5 py-3 font-bold text-slate-900 hover:bg-marca-oscuro"
                >
                  Ver todas las reservas
                </Link>
              </div>

              {reservasRecientes.length === 0 ? (
                <div className="rounded-2xl bg-white p-10 text-center text-slate-600">
                  Todavía no hay reservas recientes.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[850px] text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="px-5 py-4">Código</th>
                        <th className="px-5 py-4">Cliente</th>
                        <th className="px-5 py-4">Tour</th>
                        <th className="px-5 py-4">Personas</th>
                        <th className="px-5 py-4">Monto</th>
                        <th className="px-5 py-4">Estado</th>
                        <th className="px-5 py-4">Fecha de reserva</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {reservasRecientes.map((reserva) => (
                        <tr key={reserva.id} className="hover:bg-slate-50">
                          <td className="px-5 py-4 font-semibold">
                            {reserva.codigo || reserva.id}
                          </td>

                          <td className="px-5 py-4">
                            {reserva.nombreCliente}
                          </td>

                          <td className="px-5 py-4">
                            {reserva.nombreTour}
                          </td>

                          <td className="px-5 py-4">
                            {reserva.cantidadPersonas}
                          </td>

                          <td className="px-5 py-4 font-semibold">
                            {formatearMonto(reserva.montoTotal)}
                          </td>

                          <td className="px-5 py-4">
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${estiloEstado(reserva.estado)}`}>
                              {reserva.estado}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-slate-600">
                            {formatearFecha(reserva.fechaReserva)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : (
          <div className="rounded-2xl bg-white p-10 text-center text-slate-600">
            No hay datos disponibles para mostrar.
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
