
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Clock3,
  ArrowRight,
  Mountain,
} from "lucide-react";

function TourCard({ tour }) {
  const [imagenError, setImagenError] = useState(false);

  const precio = Number(tour.precio ?? 0);

  // Solo mostramos la imagen si tiene una ruta válida
  const mostrarImagen = Boolean(tour.imagenUrl) && !imagenError;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      {/* Imagen o diseño provisional */}
      <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-amber-50 to-slate-100">

        {mostrarImagen ? (
          <img
            src={tour.imagenUrl}
            alt={tour.nombre}
            onError={() => setImagenError(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-amber-700">
            <Mountain size={58} strokeWidth={1.4} />
            <span className="text-sm font-semibold">
              VICUGNA TRAVEL
            </span>
          </div>
        )}

        <span className="absolute left-4 top-4 rounded-full bg-marca px-3 py-1 text-xs font-bold text-slate-900">
          Tour turístico
        </span>
      </div>

      {/* Información del tour */}
      <div className="p-6">

        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <MapPin size={17} className="text-marca-oscuro" />
          <span>{tour.destino || "Ayacucho, Perú"}</span>
        </div>

        <h3 className="mb-3 text-xl font-extrabold text-slate-900">
          {tour.nombre}
        </h3>

        <p className="mb-5 line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-600">
          {tour.descripcion || "Descubre este destino con VICUGNA TRAVEL."}
        </p>

        <div className="mb-5 flex items-center gap-2 text-sm text-slate-600">
          <Clock3 size={18} className="text-marca-oscuro" />

          <span>
            {tour.duracionHoras != null
              ? `${tour.duracionHoras} horas`
              : "Duración por consultar"}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">

          <div>
            <p className="text-xs text-slate-500">
              Precio por persona
            </p>

            <p className="text-2xl font-extrabold text-slate-900">
              {tour.precio != null
                ? `S/ ${precio.toFixed(2)}`
                : "Consultar"}
            </p>
          </div>

          <Link
            to={`/tours/${tour.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-marca px-4 py-3 text-sm font-bold text-slate-900 transition hover:bg-marca-oscuro"
          >
            Ver detalles
            <ArrowRight size={17} />
          </Link>

        </div>
      </div>
    </article>
  );
}

export default TourCard;
