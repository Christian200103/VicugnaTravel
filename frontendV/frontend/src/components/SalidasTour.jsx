
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Clock3,
  Users,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

import salidaTourService from "../services/salidaTourService";
import ReservaForm from "./ReservaForm";
function SalidasTour({ tourId }) {
  const [salidas, setSalidas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [salidaSeleccionada, setSalidaSeleccionada] = useState(null);

  useEffect(() => {
    let activo = true;

    const cargarSalidas = async () => {
      setCargando(true);
      setError("");
      setSalidaSeleccionada(null);

      try {
        const datos = await salidaTourService.listarPorTour(tourId);

        if (activo) {
          setSalidas(Array.isArray(datos) ? datos : []);
        }
      } catch (err) {
        console.error("Error al cargar salidas:", err);

        if (activo) {
          setError("No se pudieron cargar las salidas programadas.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarSalidas();

    return () => {
      activo = false;
    };
  }, [tourId]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Fecha por confirmar";

    const [anio, mes, dia] = fecha.split("-").map(Number);

    return new Intl.DateTimeFormat("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(Date.UTC(anio, mes - 1, dia)));
  };

  const formatearHora = (hora) => {
    if (!hora) return "Hora por confirmar";

    return hora.slice(0, 5);
  };

  const fechaActual = new Date();
  const hoy = [
    fechaActual.getFullYear(),
    String(fechaActual.getMonth() + 1).padStart(2, "0"),
    String(fechaActual.getDate()).padStart(2, "0"),
  ].join("-");

  // Solo se permite seleccionar salidas futuras con cupos.
  // La disponibilidad definitiva se validará en Spring Boot.
  const puedeSeleccionar = (salida) => {
    const estado = String(salida.estado || "").toUpperCase();

    return (
      salida.fecha > hoy &&
      Number(salida.cuposDisponibles) > 0 &&
      estado !== "CANCELADA"
    );
  };
    
  const actualizarSalidas = async () => {
    try {
      const datos = await salidaTourService.listarPorTour(tourId);

      if (Array.isArray(datos)) {
        setSalidas(datos);
      }
    } catch (err) {
      console.error("No se pudieron actualizar los cupos:", err);
    }
  };


  return (
    <section className="mt-16">
      <div className="mb-8">
        <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
          Planifica tu aventura
        </p>

        <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
          Salidas programadas
        </h2>

        <p className="mt-3 text-slate-600">
          Consulta las fechas, horarios y cupos disponibles para este tour.
        </p>
      </div>

      {cargando ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl bg-white p-12">
          <LoaderCircle
            size={28}
            className="animate-spin text-marca-oscuro"
          />
          <p className="text-slate-600">
            Consultando salidas...
          </p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-white p-6">
          <AlertCircle className="text-red-500" />
          <p className="text-slate-700">{error}</p>
        </div>
      ) : salidas.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <CalendarDays
            size={42}
            className="mx-auto mb-4 text-marca-oscuro"
          />

          <h3 className="text-xl font-bold text-slate-900">
            No hay salidas programadas
          </h3>

          <p className="mt-2 text-slate-600">
            Por el momento no existen salidas registradas para este tour.
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {salidas.map((salida) => {
              const disponible = puedeSeleccionar(salida);
              const seleccionada = salidaSeleccionada?.id === salida.id;

              return (
                <article
                  key={salida.id}
                  className={`rounded-2xl border bg-white p-6 shadow-sm transition ${
                    seleccionada
                      ? "border-marca shadow-md"
                      : "border-slate-200"
                  }`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                      Salida turística
                    </span>

                    <span
                      className={`text-xs font-semibold ${
                        disponible ? "text-green-700" : "text-slate-500"
                      }`}
                    >
                      {disponible ? "Disponible" : "No disponible"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="text-marca-oscuro" />

                      <div>
                        <p className="text-xs text-slate-500">Fecha</p>
                        <p className="font-bold capitalize text-slate-900">
                          {formatearFecha(salida.fecha)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock3 className="text-marca-oscuro" />

                      <div>
                        <p className="text-xs text-slate-500">Hora de salida</p>
                        <p className="font-bold text-slate-900">
                          {formatearHora(salida.horaSalida)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="text-marca-oscuro" />

                      <div>
                        <p className="text-xs text-slate-500">
                          Cupos disponibles
                        </p>
                        <p className="font-bold text-slate-900">
                          {salida.cuposDisponibles} de {salida.cuposTotales}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!disponible}
                    onClick={() => setSalidaSeleccionada(salida)}
                    className={`mt-6 w-full rounded-xl px-4 py-3 font-bold transition ${
                      disponible
                        ? "bg-marca text-slate-900 hover:bg-marca-oscuro"
                        : "cursor-not-allowed bg-slate-100 text-slate-400"
                    }`}
                  >
                    {seleccionada
                      ? "Salida seleccionada"
                      : disponible
                        ? "Seleccionar salida"
                        : "No disponible"}
                  </button>
                </article>
              );
            })}
          </div>

          
          {salidaSeleccionada && (
            <>
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <h3 className="text-xl font-bold text-slate-900">
                  Salida seleccionada
                </h3>

                <p className="mt-3 text-slate-700">
                  Has seleccionado el viaje del{" "}
                  <strong>
                    {formatearFecha(salidaSeleccionada.fecha)}
                  </strong>
                  , a las{" "}
                  <strong>
                    {formatearHora(salidaSeleccionada.horaSalida)}
                  </strong>.
                </p>
              </div>

              <ReservaForm
                key={salidaSeleccionada.id}
                salida={salidaSeleccionada}
                onReservaCreada={actualizarSalidas}
              />
            </>
          )}

        </>
        
      )}
    </section>
  );
}

export default SalidasTour;
