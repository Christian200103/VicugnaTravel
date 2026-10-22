
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Pencil,
  Ban,
  X,
  MapPin,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import adminTourService from "../services/adminTourService";

const formularioInicial = {
  nombre: "",
  destino: "",
  descripcion: "",
  precio: "",
  duracionHoras: "",
  imagenUrl: "",
};

function AdminTours() {
  const { usuario, accessToken, autenticado } = useAuth();

  const [tours, setTours] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const esAdmin = autenticado && usuario?.rol === "ADMIN";

  const cargarTours = async () => {
    setCargando(true);
    setError("");

    try {
      const datos = await adminTourService.listarTodos(accessToken);
      setTours(Array.isArray(datos) ? datos : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los tours.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (esAdmin && accessToken) {
      cargarTours();
    }
    // Se carga al acceder como administrador.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esAdmin, accessToken]);

  const actualizarCampo = (evento) => {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const nuevoTour = () => {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setError("");
    setMensaje("");
    setMostrarFormulario(true);
  };

  const editarTour = (tour) => {
    setFormulario({
      nombre: tour.nombre ?? "",
      destino: tour.destino ?? "",
      descripcion: tour.descripcion ?? "",
      precio: String(tour.precio ?? ""),
      duracionHoras: String(tour.duracionHoras ?? ""),
      imagenUrl: tour.imagenUrl ?? "",
    });

    setEditandoId(tour.id);
    setError("");
    setMensaje("");
    setMostrarFormulario(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarTour = async (evento) => {
    evento.preventDefault();

    const precio = Number(formulario.precio);
    const duracionHoras = Number(formulario.duracionHoras);

    if (
      !formulario.nombre.trim() ||
      !formulario.destino.trim() ||
      !Number.isFinite(precio) ||
      precio <= 0 ||
      !Number.isInteger(duracionHoras) ||
      duracionHoras < 1
    ) {
      setError("Completa correctamente los campos obligatorios.");
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      destino: formulario.destino.trim(),
      descripcion: formulario.descripcion.trim(),
      precio,
      duracionHoras,
      imagenUrl: formulario.imagenUrl.trim(),
    };

    setGuardando(true);
    setError("");
    setMensaje("");

    try {
      if (editandoId !== null) {
        await adminTourService.actualizar(
          editandoId,
          datos,
          accessToken
        );
        setMensaje("Tour actualizado correctamente.");
      } else {
        await adminTourService.crear(datos, accessToken);
        setMensaje("Tour registrado correctamente.");
      }

      setMostrarFormulario(false);
      setFormulario(formularioInicial);
      setEditandoId(null);
      await cargarTours();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "No se pudo guardar el tour."
      );
    } finally {
      setGuardando(false);
    }
  };

  const desactivarTour = async (tour) => {
    if (
      !window.confirm(
        `¿Deseas desactivar el tour "${tour.nombre}"?`
      )
    ) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      await adminTourService.desactivar(tour.id, accessToken);
      setMensaje("Tour desactivado correctamente.");
      await cargarTours();
    } catch (err) {
      console.error(err);
      setError("No se pudo desactivar el tour.");
    }
  };

  const formatearPrecio = (valor) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(valor ?? 0));

  if (!autenticado) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Administración de tours
        </h1>
        <p className="mt-3">Inicia sesión como administrador.</p>
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
              Administración de tours
            </h1>
            <p className="mt-2 text-slate-600">
              Registra, actualiza y administra los tours turísticos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={cargarTours}
              className="flex items-center gap-2 rounded-xl border bg-white px-4 py-3 font-semibold"
            >
              <RefreshCw size={18} />
              Actualizar
            </button>

            <button
              type="button"
              onClick={nuevoTour}
              className="flex items-center gap-2 rounded-xl bg-marca px-5 py-3 font-bold"
            >
              <Plus size={19} />
              Nuevo tour
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-5 rounded-xl bg-green-50 p-4 text-green-700">
            {mensaje}
          </div>
        )}

        {mostrarFormulario && (
          <section className="mb-9 rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {editandoId !== null
                  ? "Editar tour"
                  : "Registrar nuevo tour"}
              </h2>

              <button
                type="button"
                onClick={() => setMostrarFormulario(false)}
                disabled={guardando}
                aria-label="Cerrar formulario"
              >
                <X size={23} />
              </button>
            </div>

            <form
              onSubmit={guardarTour}
              className="grid gap-5 md:grid-cols-2"
            >
              <label className="block">
                <span className="mb-2 block font-semibold">
                  Nombre del tour *
                </span>
                <input
                  name="nombre"
                  value={formulario.nombre}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="Ej. Aguas Turquesas de Millpu"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-semibold">
                  Destino *
                </span>
                <input
                  name="destino"
                  value={formulario.destino}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="Ej. Circamarca, Ayacucho"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-semibold">
                  Precio (S/) *
                </span>
                <input
                  name="precio"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formulario.precio}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border px-4 py-3"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-semibold">
                  Duración (horas) *
                </span>
                <input
                  name="duracionHoras"
                  type="number"
                  min="1"
                  step="1"
                  value={formulario.duracionHoras}
                  onChange={actualizarCampo}
                  required
                  className="w-full rounded-xl border px-4 py-3"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block font-semibold">
                  URL de imagen
                </span>
                <input
                  name="imagenUrl"
                  value={formulario.imagenUrl}
                  onChange={actualizarCampo}
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </label>

              <label className="block md:col-span-2">
                <span className="mb-2 block font-semibold">
                  Descripción
                </span>
                <textarea
                  name="descripcion"
                  value={formulario.descripcion}
                  onChange={actualizarCampo}
                  rows={4}
                  className="w-full rounded-xl border px-4 py-3"
                  placeholder="Describe la experiencia turística..."
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
                      : "Registrar tour"}
                </button>

                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  disabled={guardando}
                  className="rounded-xl border px-6 py-3 font-semibold"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {cargando ? (
          <div className="rounded-xl bg-white p-10 text-center">
            Cargando tours...
          </div>
        ) : tours.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center text-slate-600">
            No hay tours registrados.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-5 py-4">Tour</th>
                  <th className="px-5 py-4">Destino</th>
                  <th className="px-5 py-4">Precio</th>
                  <th className="px-5 py-4">Duración</th>
                  <th className="px-5 py-4">Estado</th>
                  <th className="px-5 py-4">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {tours.map((tour) => (
                  <tr key={tour.id}>
                    <td className="px-5 py-4 font-semibold">
                      {tour.nombre}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1">
                        <MapPin size={15} />
                        {tour.destino}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {formatearPrecio(tour.precio)}
                    </td>
                    <td className="px-5 py-4">
                      {tour.duracionHoras} horas
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          tour.estado === "ACTIVO"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {tour.estado}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => editarTour(tour)}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 font-semibold text-blue-700"
                        >
                          <Pencil size={15} />
                          Editar
                        </button>

                        {tour.estado === "ACTIVO" && (
                          <button
                            type="button"
                            onClick={() => desactivarTour(tour)}
                            className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 font-semibold text-red-700"
                          >
                            <Ban size={15} />
                            Desactivar
                          </button>
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

export default AdminTours;
