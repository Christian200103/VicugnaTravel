
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import reservaService from "../services/reservaService";
import { FileDown } from "lucide-react";
import comprobanteService from "../services/comprobanteService";
function AdminReservas() {
  const { usuario, accessToken, autenticado } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const esAdmin = autenticado && usuario?.rol === "ADMIN";

  const cargarReservas = useCallback(async () => {
    if (!esAdmin || !accessToken) {
      setCargando(false);
      return;
    }

    setCargando(true);
    setError("");

    try {
      const datos = await reservaService.listarTodas(accessToken);
      setReservas(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error("Error al consultar reservas:", err);
      setError("No se pudieron cargar las reservas.");
    } finally {
      setCargando(false);
    }
  }, [accessToken, esAdmin]);

  useEffect(() => {
    cargarReservas();
  }, [cargarReservas]);

  const cambiarEstado = async (reserva, accion) => {
    const descripcion =
      accion === "confirmar" ? "confirmar" : "cancelar";

    const aceptado = window.confirm(
      `¿Deseas ${descripcion} la reserva ${reserva.codigo || reserva.id}?`
    );

    if (!aceptado) return;

    setProcesandoId(reserva.id);
    setError("");
    setMensaje("");

    try {
      if (accion === "confirmar") {
        await reservaService.confirmar(reserva.id, accessToken);
      } else {
        await reservaService.cancelar(reserva.id, accessToken);
      }

      setMensaje(`Reserva ${descripcion === "confirmar" ? "confirmada" : "cancelada"} correctamente.`);
      await cargarReservas();
    } catch (err) {
      const detalle =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        "No se pudo actualizar la reserva.";

      setError(detalle);
    } finally {
      setProcesandoId(null);
    }
  };

  const formatearMonto = (monto) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(monto || 0));

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
  
  const descargarComprobante = async (reserva) => {
    try {
      setError("");
      setMensaje("");

      await comprobanteService.descargarReserva(
        reserva.id,
        accessToken
      );

      setMensaje(
        `Comprobante de la reserva ${reserva.codigo} descargado correctamente.`
      );
    } catch (err) {
      console.error("Error al descargar comprobante:", err);

      setError(
        "No se pudo descargar el comprobante de la reserva."
      );
    }
  };


  if (!autenticado) {
    return (
      <main className="mx-auto min-h-[60vh] max-w-5xl px-6 py-20 text-center">
        <h1 className="text-3xl font-bold">Panel administrativo</h1>
        <p className="mt-4 text-slate-600">
          Debes iniciar sesión para acceder.
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
        <h1 className="mt-4 text-2xl font-bold">
          Acceso restringido
        </h1>
        <p className="mt-3 text-slate-600">
          Esta sección es exclusiva del administrador.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-6 py-14">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
              Administración
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Gestión de reservas
            </h1>
            <p className="mt-2 text-slate-600">
              Consulta y administra las reservas turísticas.
            </p>
          </div>

          <button
            type="button"
            onClick={cargarReservas}
            disabled={cargando || procesandoId !== null}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div role="status" className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
            {mensaje}
          </div>
        )}

        {cargando ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            Cargando reservas...
          </div>
        ) : reservas.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center">
            <ClipboardList size={44} className="mx-auto mb-4 text-marca-oscuro" />
            <p className="font-semibold text-slate-700">
              No hay reservas registradas.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-5 py-4">Código</th>
                  <th className="px-5 py-4">Cliente</th>
                  <th className="px-5 py-4">Tour</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Personas</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reservas.map((reserva) => (
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
                      {reserva.fechaSalida || "Sin fecha"}
                      <div className="text-xs text-slate-500">
                        {reserva.horaSalida?.slice(0, 5)}
                      </div>
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

                    <td className="px-5 py-4">
                      {reserva.estado === "PENDIENTE" ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={procesandoId !== null}
                            onClick={() => cambiarEstado(reserva, "confirmar")}
                            className="flex items-center gap-1 rounded-lg bg-green-100 px-3 py-2 font-semibold text-green-800 disabled:opacity-50"
                          >
                            <CheckCircle2 size={16} />
                            Confirmar
                          </button>

                          <button
                            type="button"
                            disabled={procesandoId !== null}
                            onClick={() => cambiarEstado(reserva, "cancelar")}
                            className="flex items-center gap-1 rounded-lg bg-red-100 px-3 py-2 font-semibold text-red-800 disabled:opacity-50"
                          >
                            <XCircle size={16} />
                            Cancelar
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => descargarComprobante(reserva)}
                            className="flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <FileDown size={17} />
                            PDF
                          </button>

                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Sin acciones
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminReservas;
