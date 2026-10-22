
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Wallet,
  CreditCard,
  RefreshCw,
  XCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import reservaService from "../services/reservaService";
import pagoService from "../services/pagoService";

const formatearMonto = (valor) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
  }).format(Number(valor ?? 0));

function AdminPagos() {
  const { usuario, accessToken, autenticado } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [reservaId, setReservaId] = useState("");
  const [resumen, setResumen] = useState(null);
  const [pagos, setPagos] = useState([]);
  const [monto, setMonto] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [referenciaOperacion, setReferenciaOperacion] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const esAdmin = autenticado && usuario?.rol === "ADMIN";

  useEffect(() => {
    if (!esAdmin || !accessToken) return;

    let activo = true;

    const cargarReservas = async () => {
      try {
        const datos = await reservaService.listarTodas(accessToken);

        if (activo) {
          setReservas(Array.isArray(datos) ? datos : []);
        }
      } catch (err) {
        console.error(err);
        if (activo) setError("No se pudieron cargar las reservas.");
      }
    };

    cargarReservas();

    return () => {
      activo = false;
    };
  }, [esAdmin, accessToken]);

  useEffect(() => {
    if (!esAdmin || !accessToken || !reservaId) {
      setResumen(null);
      setPagos([]);
      return;
    }

    let activo = true;

    const cargarPagos = async () => {
      setCargando(true);
      setError("");

      try {
        const [datosResumen, datosPagos] = await Promise.all([
          pagoService.obtenerResumen(reservaId, accessToken),
          pagoService.listarPorReserva(reservaId, accessToken),
        ]);

        if (activo) {
          setResumen(datosResumen);
          setPagos(Array.isArray(datosPagos) ? datosPagos : []);
        }
      } catch (err) {
        console.error(err);
        if (activo) {
          setError("No se pudieron consultar los pagos de la reserva.");
        }
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPagos();

    return () => {
      activo = false;
    };
  }, [esAdmin, accessToken, reservaId]);

  const actualizarPagos = async () => {
    if (!reservaId) return;

    const [datosResumen, datosPagos] = await Promise.all([
      pagoService.obtenerResumen(reservaId, accessToken),
      pagoService.listarPorReserva(reservaId, accessToken),
    ]);

    setResumen(datosResumen);
    setPagos(Array.isArray(datosPagos) ? datosPagos : []);
  };

  const registrarPago = async (evento) => {
    evento.preventDefault();

    const valorMonto = Number(monto);

    if (!reservaId || !Number.isFinite(valorMonto) || valorMonto <= 0) {
      setError("Selecciona una reserva e ingresa un monto válido.");
      return;
    }

    if (!metodoPago) {
      setError("Selecciona un método de pago.");
      return;
    }

    if (resumen && valorMonto > Number(resumen.saldoPendiente)) {
      setError("El monto supera el saldo pendiente de la reserva.");
      return;
    }

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      await pagoService.registrar(
        {
          reservaId: Number(reservaId),
          monto: valorMonto,
          metodoPago,
          referenciaOperacion: referenciaOperacion.trim(),
          observaciones: observaciones.trim(),
        },
        accessToken
      );

      setMensaje("Pago registrado correctamente.");
      setMonto("");
      setMetodoPago("");
      setReferenciaOperacion("");
      setObservaciones("");

      await actualizarPagos();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "No se pudo registrar el pago."
      );
    } finally {
      setGuardando(false);
    }
  };

  const anularPago = async (pago) => {
    if (!window.confirm(`¿Deseas anular el pago N.º ${pago.id}?`)) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      await pagoService.anular(pago.id, accessToken);
      setMensaje("Pago anulado correctamente.");
      await actualizarPagos();
    
      } catch (err) {
        console.error("Error al registrar pago:", err);
        console.log("Respuesta del backend:", err.response?.data);

        const respuesta = err.response?.data;

        setError(
          respuesta?.message ||
          respuesta?.mensaje ||
          respuesta?.error ||
          (typeof respuesta === "string" ? respuesta : null) ||
          "No se pudo registrar el pago."
        );
      }

  };

  if (!autenticado) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">Administración de pagos</h1>
        <p className="mt-3">Inicia sesión como administrador.</p>
        <Link to="/login" className="mt-5 inline-block rounded-xl bg-marca px-6 py-3 font-bold">
          Iniciar sesión
        </Link>
      </main>
    );
  }

  if (!esAdmin) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Acceso restringido</h1>
        <p className="mt-3">Esta sección es exclusiva del administrador.</p>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
            VICUGNA TRAVEL
          </p>
          <h1 className="mt-2 text-3xl font-extrabold">
            Administración de pagos
          </h1>
          <p className="mt-2 text-slate-600">
            Consulta saldos y administra los pagos de las reservas.
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-5 rounded-xl bg-green-50 p-4 text-green-700">
            {mensaje}
          </div>
        )}

        <section className="mb-7 rounded-2xl border bg-white p-6 shadow-sm">
          <label className="block font-semibold">
            Seleccionar reserva
          </label>
          <select
            value={reservaId}
            onChange={(evento) => {
              setReservaId(evento.target.value);
              setMensaje("");
              setError("");
            }}
            className="mt-3 w-full rounded-xl border bg-white px-4 py-3"
          >
            <option value="">Selecciona una reserva</option>
            {reservas.map((reserva) => (
              <option key={reserva.id} value={reserva.id}>
                {reserva.codigo} — {reserva.nombreCliente} — {reserva.nombreTour}
              </option>
            ))}
          </select>
        </section>

        {reservaId && (
          <>
            {cargando ? (
              <div className="rounded-xl bg-white p-8 text-center">
                Cargando pagos...
              </div>
            ) : resumen ? (
              <>
                <section className="mb-7 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border bg-white p-6">
                    <Wallet className="text-blue-600" />
                    <p className="mt-3 text-sm text-slate-600">Monto total</p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatearMonto(resumen.montoTotal)}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-white p-6">
                    <CreditCard className="text-green-600" />
                    <p className="mt-3 text-sm text-slate-600">Monto pagado</p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatearMonto(resumen.montoPagado)}
                    </p>
                  </div>

                  <div className="rounded-2xl border bg-white p-6">
                    <Wallet className="text-amber-600" />
                    <p className="mt-3 text-sm text-slate-600">Saldo pendiente</p>
                    <p className="mt-2 text-2xl font-bold">
                      {formatearMonto(resumen.saldoPendiente)}
                    </p>
                  </div>
                </section>

                <p className="mb-7 text-sm font-semibold text-slate-600">
                  Estado financiero: {resumen.estadoFinanciero}
                </p>

                <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
                  <h2 className="mb-5 text-xl font-bold">Registrar pago</h2>

                  <form onSubmit={registrarPago} className="grid gap-5 md:grid-cols-2">
                    <label>
                      <span className="mb-2 block font-semibold">
                        Monto (S/) *
                      </span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={monto}
                        onChange={(evento) => setMonto(evento.target.value)}
                        required
                        className="w-full rounded-xl border px-4 py-3"
                      />
                    </label>

                    <label>
                      <span className="mb-2 block font-semibold">
                        Método de pago *
                      </span>
                        <select
                        value={metodoPago}
                        onChange={(evento) => setMetodoPago(evento.target.value)}
                        required
                        className="w-full rounded-xl border bg-white px-4 py-3"
                        >
                        <option value="">Selecciona un método de pago</option>
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="YAPE">Yape</option>
                        <option value="PLIN">Plin</option>
                        <option value="TRANSFERENCIA">Transferencia bancaria</option>
                        <option value="TARJETA">Tarjeta</option>
                        <option value="PASARELA_ONLINE">Pasarela online</option>
                        </select>
                    </label>

                    <label className="md:col-span-2">
                      <span className="mb-2 block font-semibold">
                        Referencia de operación
                      </span>
                      <input
                        value={referenciaOperacion}
                        onChange={(evento) => setReferenciaOperacion(evento.target.value)}
                        maxLength={120}
                        className="w-full rounded-xl border px-4 py-3"
                      />
                    </label>

                    <label className="md:col-span-2">
                      <span className="mb-2 block font-semibold">
                        Observaciones
                      </span>
                      <textarea
                        value={observaciones}
                        onChange={(evento) => setObservaciones(evento.target.value)}
                        maxLength={500}
                        rows={3}
                        className="w-full rounded-xl border px-4 py-3"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={guardando || Number(resumen.saldoPendiente) <= 0}
                      className="rounded-xl bg-marca px-6 py-3 font-bold disabled:opacity-50"
                    >
                      {guardando ? "Guardando..." : "Registrar pago"}
                    </button>
                  </form>
                </section>

                <section className="rounded-2xl border bg-white p-6 shadow-sm">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold">Historial de pagos</h2>
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await actualizarPagos();
                        } catch {
                          setError("No se pudieron actualizar los pagos.");
                        }
                      }}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2"
                    >
                      <RefreshCw size={16} />
                      Actualizar
                    </button>
                  </div>

                  {pagos.length === 0 ? (
                    <p className="text-slate-600">
                      No hay pagos registrados para esta reserva.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[750px] text-left text-sm">
                        <thead className="bg-slate-100">
                          <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Monto</th>
                            <th className="px-4 py-3">Método</th>
                            <th className="px-4 py-3">Referencia</th>
                            <th className="px-4 py-3">Estado</th>
                            <th className="px-4 py-3">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {pagos.map((pago) => (
                            <tr key={pago.id}>
                              <td className="px-4 py-3">
                                {pago.fechaPago
                                  ? new Date(pago.fechaPago).toLocaleString("es-PE")
                                  : "-"}
                              </td>
                              <td className="px-4 py-3 font-semibold">
                                {formatearMonto(pago.monto)}
                              </td>
                              <td className="px-4 py-3">{pago.metodoPago}</td>
                              <td className="px-4 py-3">
                                {pago.referenciaOperacion || "-"}
                              </td>
                              <td className="px-4 py-3">{pago.estado}</td>
                              <td className="px-4 py-3">
                                {pago.estado === "REGISTRADO" && (
                                  <button
                                    type="button"
                                    onClick={() => anularPago(pago)}
                                    className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700"
                                  >
                                    <XCircle size={15} />
                                    Anular
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}

export default AdminPagos;
