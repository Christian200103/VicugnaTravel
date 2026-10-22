
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock3,
  Mountain,
  AlertCircle,
  LoaderCircle,
  CalendarDays,
} from "lucide-react";

import tourService from "../services/tourService";
import SalidasTour from "../components/SalidasTour";

function DetalleTour() {
  const { id } = useParams();

  const [tour, setTour] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [imagenError, setImagenError] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarTour = async () => {
      setCargando(true);
      setError("");
      setImagenError(false);

      try {
        const datos = await tourService.obtenerPorId(id);

        if (activo) {
          setTour(datos);
        }
      } catch (err) {
        console.error("Error al cargar el tour:", err);

        if (activo) {
          setError("No se pudo obtener la información del tour.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarTour();

    return () => {
      activo = false;
    };
  }, [id]);

  if (cargando) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <LoaderCircle
          size={42}
          className="animate-spin text-marca-oscuro"
        />
        <p className="text-slate-600">
          Cargando información del tour...
        </p>
      </div>
    );
  }

  if (error || !tour) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-4xl flex-col items-center justify-center gap-5 px-6 text-center">
        <AlertCircle size={48} className="text-red-500" />

        <h2 className="text-2xl font-bold text-slate-900">
          No se pudo mostrar el tour
        </h2>

        <p className="text-slate-600">
          {error || "El tour solicitado no está disponible."}
        </p>

        <Link
          to="/"
          className="rounded-xl bg-marca px-6 py-3 font-bold text-slate-900"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const mostrarImagen = Boolean(tour.imagenUrl) && !imagenError;

  return (
    <main className="bg-slate-50 pb-20">

      <div className="mx-auto max-w-7xl px-6 pt-10">

        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-marca-oscuro"
        >
          <ArrowLeft size={19} />
          Volver a destinos
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Imagen del destino */}
          <div className="relative flex min-h-[350px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-amber-100 to-slate-200">

            {mostrarImagen ? (
              <img
                src={tour.imagenUrl}
                alt={tour.nombre}
                onError={() => setImagenError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-amber-700">
                <Mountain size={85} strokeWidth={1.3} />
                <span className="font-bold">
                  VICUGNA TRAVEL
                </span>
              </div>
            )}
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center">

            <div className="mb-4 flex items-center gap-2 text-marca-oscuro">
              <MapPin size={20} />
              <span className="font-semibold">
                {tour.destino || "Ayacucho, Perú"}
              </span>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 md:text-5xl">
              {tour.nombre}
            </h1>

            <p className="mt-6 whitespace-pre-line leading-8 text-slate-600">
              {tour.descripcion || "Información del recorrido próximamente."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">
                <Clock3 className="text-marca-oscuro" />
                <div>
                  <p className="text-xs text-slate-500">Duración</p>
                  <p className="font-bold text-slate-900">
                    {tour.duracionHoras != null
                      ? `${tour.duracionHoras} horas`
                      : "Por consultar"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-sm">
                <CalendarDays className="text-marca-oscuro" />
                <div>
                  <p className="text-xs text-slate-500">Salidas</p>
                  <p className="font-bold text-slate-900">
                    Consultar disponibilidad
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-9 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Precio por persona
              </p>

              <p className="mt-1 text-4xl font-extrabold text-slate-900">
                {tour.precio != null
                  ? `S/ ${Number(tour.precio).toFixed(2)}`
                  : "Consultar"}
              </p>

              <p className="mt-4 text-sm text-slate-500">
                Próximamente podrás seleccionar una salida
                programada y realizar tu reserva en línea.
              </p>
            </div>

          </div>
        </div>
        {/* Salidas programadas del tour */}
        <SalidasTour tourId={tour.id} />
      </div>

    </main>
  );
}

export default DetalleTour;
