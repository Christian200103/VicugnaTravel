
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  XCircle,
  RefreshCw,
  CalendarDays,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import adminSalidaService from "../services/adminSalidaService";
import adminTourService from "../services/adminTourService";

const inicial = {
  tourId: "",
  fecha: "",
  horaSalida: "",
  cuposTotales: "",
};

const fechaLocal = () => {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

function AdminSalidas() {
  const { usuario, accessToken, autenticado } = useAuth();

  const [salidas, setSalidas] = useState([]);
  const [tours, setTours] = useState([]);
  const [formulario, setFormulario] = useState(inicial);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [procesandoId, setProcesandoId] = useState(null);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const esAdmin = autenticado && usuario?.rol === "ADMIN";

  const cargarDatos = async () => {
    setCargando(true);
    setError("");

    try {
      const [datosSalidas, datosTours] = await Promise.all([
        adminSalidaService.listarTodas(accessToken),
        adminTourService.listarTodos(accessToken),
      ]);

      setSalidas(Array.isArray(datosSalidas) ? datosSalidas : []);
      setTours(Array.isArray(datosTours) ? datosTours : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las salidas y los tours.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (esAdmin && accessToken) {
      cargarDatos();
    }
    // Carga inicial al ingresar al módulo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esAdmin, accessToken]);

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const nuevaSalida = () => {
    setFormulario(inicial);
    setEditandoId(null);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
  };

  const editarSalida = (salida) => {
    setFormulario({
      tourId: String(salida.tourId ?? ""),
      fecha: salida.fecha ?? "",
      horaSalida: String(salida.horaSalida ?? "").slice(0, 5),
      cuposTotales: String(salida.cuposTotales ?? ""),
    });

    setEditandoId(salida.id);
    setMostrarFormulario(true);
    setError("");
    setMensaje("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarSalida = async (evento) => {
    evento.preventDefault();

    const tourId = Number(formulario.tourId);
    const cuposTotales = Number(formulario.cuposTotales);

    if (
      !Number.isInteger(tourId) ||
      tourId < 1 ||
      !formulario.fecha ||
      !formulario.horaSalida ||
      !Number.isInteger(cuposTotales) ||
      cuposTotales < 1
    ) {
      setError("Completa correctamente todos los campos.");
      return;
    }

    if (formulario.fecha < fechaLocal()) {
      setError("La fecha de salida no puede estar en el pasado.");
      return;
    }

    const datos = {
      tourId,
      fecha: formulario.fecha,
      horaSalida: formulario.horaSalida,
      cuposTotales,
    };

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      if (editandoId !== null) {
        await adminSalidaService.actualizar(
          editandoId,
          datos,
          accessToken
        );
        setMensaje("Salida actualizada correctamente.");
      } else {
        await adminSalidaService.crear(datos, accessToken);
        setMensaje("Salida registrada correctamente.");
      }

      setMostrarFormulario(false);
      setFormulario(inicial);
      setEditandoId(null);
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "No se pudo guardar la salida. Verifica los datos."
      );
    } finally {
      setGuardando(false);
    }
  };

  const cancelarSalida = async (salida) => {
    if (
      !window.confirm(
        `¿Deseas cancelar la salida del tour "${salida.nombreTour}" del ${salida.fecha}?`
      )
    ) {
      return;
    }

    setProcesandoId(salida.id);
    setError("");
    setMensaje("");

    try {
      await adminSalidaService.cancelar(salida.id, accessToken);
      setMensaje("Salida cancelada correctamente.");
      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "No se pudo cancelar la salida."
      );
    } finally {
      setProcesandoId(null);
    }
  };

  if (!autenticado) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Administración de salidas
        </h1>
        <p className="mt-3">
          Inicia sesión como administrador.
        </p>
        <Link
          to="/login"
          className="mt-5 inline-block rounded-xl bg-marca px-6 py-3 font-bold"
        >
          Iniciar sesión
        </Link>
      </main>
    );
  }

  if (!esAdmin) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Acceso restringido
        </h1>
        <p className="mt-3">
          Esta sección es exclusiva del administrador.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
              VICUGNA TRAVEL
            </p>
            <h1 className="mt-2 text-3xl font-extrabold">
              Administración de salidas
            </h1>
            <p className="mt-2 text-slate-600">
              Programa fechas, horarios y cupos para los tours.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={cargarDatos}
              disabled={cargando}
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold disabled:opacity-50"
            >
              <RefreshCw size={18} />
              Actualizar
            </button>

            <button
              type="button"
              onClick={nuevaSalida}
              className="flex items-center gap-2 rounded-xl bg-marca px-5 py-3 font-bold"
            >
              <Plus size={18} />
              Nueva salida
            </button>
          </div>
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

        {mostrarFormulario && (
          <section className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">
              {editandoId !== null
                ? "Editar salida"
                : "Registrar nueva salida"}
            </h2>

            <form onSubmit={guardarSalida} className="grid gap-5 md:grid-cols-2">
              <label>
                <span className="mb-2 block font-semibold">Tour *</span>
                <select
                  name="tourId"
                  value={formulario.tourId}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border bg-white px-4 py-3"
                >
                  <option value="">Selecciona un tour</option>
                  {tours
                    .filter(
                      (tour) =>
                        tour.estado === "ACTIVO" ||
                        String(tour.id) === formulario.tourId
                    )
                    .map((tour) => (
                      <option key={tour.id} value={tour.id}>
                        {tour.nombre} — {tour.destino}
                      </option>
                    ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block font-semibold">Fecha *</span>
                <input
                  name="fecha"
                  type="date"
                  min={fechaLocal()}
                  value={formulario.fecha}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border px-4 py-3"
                />
              </label>

              <label>
                <span className="mb-2 block font-semibold">
                  Hora de salida *
                </span>
                <input
                  name="horaSalida"
                  type="time"
                  value={formulario.horaSalida}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border px-4 py-3"
                />
              </label>

              <label>
                <span className="mb-2 block font-semibold">
                  Cupos totales *
                </span>
                <input
                  name="cuposTotales"
                  type="number"
                  min="1"
                  step="1"
                  value={formulario.cuposTotales}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border px-4 py-3"
                />
              </label>

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={guardando}
                  className="rounded-xl bg-marca px-6 py-3 font-bold disabled:opacity-50"
                >
                  {guardando
                    ? "Guardando..."
                    : editandoId !== null
                      ? "Guardar cambios"
                      : "Registrar salida"}
                </button>

                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  disabled={guardando}
                  className="rounded-xl border px-6 py-3 font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </section>
        )}

        {cargando ? (
          <div className="rounded-xl bg-white p-10 text-center">
            Cargando salidas...
          </div>
        ) : salidas.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-600">
            No hay salidas registradas.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-5 py-4">Tour</th>
                  <th className="px-5 py-4">Fecha</th>
                  <th className="px-5 py-4">Hora</th>
                  <th className="px-5 py-4">Cupos</th>
                  <th className="px-5 py-4">Disponibles</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {salidas.map((salida) => (
                  <tr key={salida.id}>
                    <td className="px-5 py-4 font-semibold">
                      {salida.nombreTour}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {salida.fecha}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {String(salida.horaSalida ?? "").slice(0, 5)}
                    </td>
                    <td className="px-5 py-4">{salida.cuposTotales}</td>
                    <td className="px-5 py-4 font-semibold">
                      {salida.cuposDisponibles}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          salida.estado === "CANCELADA"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {salida.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        {salida.estado !== "CANCELADA" && (
                          <>
                            <button
                              type="button"
                              onClick={() => editarSalida(salida)}
                              className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700"
                            >
                              <Pencil size={15} />
                              Editar
                            </button>

                            <button
                              type="button"
                              disabled={procesandoId === salida.id}
                              onClick={() => cancelarSalida(salida)}
                              className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700 disabled:opacity-50"
                            >
                              <XCircle size={15} />
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
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

export default AdminSalidas;
