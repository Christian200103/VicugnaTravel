
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  CalendarDays,
} from "lucide-react";

import Nosotros from "../components/Nosotros";
import ListaTours from "../components/ListaTours";

function Inicio() {
  return (
    <main>
      {/* Portada principal con fotografía de Millpu */}
      <section
        className="relative flex min-h-[620px] items-center overflow-hidden bg-slate-900 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.65) 48%, rgba(15,23,42,0.22) 100%), url('/images/tours/city.jpg')",
        }}
      >
        <div className="relative mx-auto w-full max-w-7xl px-6 py-24">
          <div className="max-w-3xl">

            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-black/30 px-4 py-2 text-sm font-semibold text-marca backdrop-blur-sm">
              <MapPin size={16} />
              Ayacucho, Perú
            </span>

            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Descubre experiencias
              <span className="text-marca"> inolvidables </span>
              en Ayacucho
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-100">
              Vive nuevas aventuras, descubre paisajes increíbles
              y disfruta de la riqueza cultural de nuestra región
              con VICUGNA TRAVEL.
            </p>

            <a
              href="#destinos"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-marca px-7 py-4 font-bold text-slate-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-marca-oscuro"
            >
              Explorar destinos
              <ArrowRight size={20} />
            </a>

          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">

          <div className="text-center">
            <MapPin
              size={35}
              className="mx-auto mb-4 text-marca-oscuro"
            />
            <h3 className="text-xl font-bold text-slate-900">
              Destinos increíbles
            </h3>
            <p className="mt-2 text-slate-600">
              Descubre la belleza natural y cultural de Ayacucho.
            </p>
          </div>

          <div className="text-center">
            <CalendarDays
              size={35}
              className="mx-auto mb-4 text-marca-oscuro"
            />
            <h3 className="text-xl font-bold text-slate-900">
              Reservas sencillas
            </h3>
            <p className="mt-2 text-slate-600">
              Consulta las salidas disponibles y organiza tu viaje.
            </p>
          </div>

          <div className="text-center">
            <ShieldCheck
              size={35}
              className="mx-auto mb-4 text-marca-oscuro"
            />
            <h3 className="text-xl font-bold text-slate-900">
              Atención personalizada
            </h3>
            <p className="mt-2 text-slate-600">
              Te acompañamos durante la planificación de tu experiencia.
            </p>
          </div>

        </div>
      </section>

      {/* Tours registrados en MySQL */}
      <ListaTours />

      {/* Misión, visión y valores */}
      <Nosotros />
    </main>
  );
}

export default Inicio;
