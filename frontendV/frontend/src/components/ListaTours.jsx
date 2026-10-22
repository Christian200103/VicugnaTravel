
import { useEffect, useState } from "react";
import { AlertCircle, LoaderCircle, MapPin } from "lucide-react";

import tourService from "../services/tourService";
import TourCard from "./TourCard";

function ListaTours() {
  const [tours, setTours] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    const cargarTours = async () => {
      try {
        const datos = await tourService.listarActivos();

        if (activo) {
          setTours(datos);
          setError("");
        }
      } catch (err) {
        if (activo) {
          console.error("Error al cargar tours:", err);
          setError("No pudimos cargar los destinos turísticos.");
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarTours();

    return () => {
      activo = false;
    };
  }, []);

  return (
    <section id="destinos" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
            Explora con nosotros
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Nuestros destinos turísticos
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Descubre nuestros recorridos y encuentra tu próxima aventura.
          </p>
        </div>

        {cargando ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <LoaderCircle
              size={42}
              className="animate-spin text-marca-oscuro"
            />
            <p className="text-slate-600">
              Cargando destinos turísticos...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-12 text-center">
            <AlertCircle size={40} className="text-red-500" />
            <p className="font-semibold text-slate-800">
              {error}
            </p>
            <p className="text-sm text-slate-500">
              Verifica que el servidor Spring Boot esté funcionando.
            </p>
          </div>
        ) : tours.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
            <MapPin size={42} className="text-marca-oscuro" />
            <h3 className="text-xl font-bold text-slate-800">
              No hay tours disponibles
            </h3>
            <p className="text-slate-500">
              Pronto publicaremos nuevos destinos turísticos.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default ListaTours;
