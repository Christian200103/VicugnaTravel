
import {
  Target,
  Eye,
  ShieldCheck,
  Handshake,
  Heart,
  Award,
  Scale,
  Users
} from "lucide-react";

const valores = [
  {
    nombre: "Responsabilidad",
    descripcion:
      "Cumplir oportunamente los compromisos asumidos con los clientes, garantizando un servicio seguro y confiable.",
    Icono: ShieldCheck
  },
  {
    nombre: "Compromiso",
    descripcion:
      "Brindar una atención personalizada que responda a las necesidades y expectativas de cada turista.",
    Icono: Handshake
  },
  {
    nombre: "Respeto",
    descripcion:
      "Valorar la diversidad cultural, el patrimonio histórico y el medio ambiente, fomentando un turismo responsable.",
    Icono: Heart
  },
  {
    nombre: "Calidad",
    descripcion:
      "Mejorar continuamente los servicios ofrecidos para garantizar experiencias satisfactorias.",
    Icono: Award
  },
  {
    nombre: "Honestidad",
    descripcion:
      "Actuar con transparencia y ética en todas las operaciones realizadas por la empresa.",
    Icono: Scale
  },
  {
    nombre: "Trabajo en equipo",
    descripcion:
      "Promover la colaboración entre los integrantes de la organización para alcanzar los objetivos institucionales.",
    Icono: Users
  }
];

function Nosotros() {
  return (
    <section id="nosotros" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">

        <div className="mb-12 text-center">
          <p className="font-semibold uppercase tracking-widest text-marca-oscuro">
            Nuestra identidad
          </p>

          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 md:text-4xl">
            Conoce VICUGNA TRAVEL
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Descubre los principios que orientan nuestro trabajo
            y nuestro compromiso con el turismo.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">

          {/* Misión */}
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-marca/20">
              <Target size={30} className="text-marca-oscuro" />
            </div>

            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Nuestra misión
            </h3>

            <p className="leading-8 text-slate-600">
              Brindar experiencias turísticas auténticas e inolvidables
              mediante la organización de servicios turísticos seguros,
              confiables y de calidad, promoviendo el patrimonio cultural
              y natural del Perú, con un enfoque orientado a la satisfacción
              de nuestros clientes y al desarrollo sostenible del turismo.
            </p>
          </article>

          {/* Visión */}
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-marca/20">
              <Eye size={30} className="text-marca-oscuro" />
            </div>

            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Nuestra visión
            </h3>

            <p className="leading-8 text-slate-600">
              Ser una agencia de turismo reconocida a nivel regional y
              nacional por la excelencia de sus servicios, la innovación
              en la gestión turística y el compromiso con la promoción
              del turismo sostenible, convirtiéndose en una de las
              principales opciones para quienes desean descubrir la
              riqueza cultural y natural del Perú.
            </p>
          </article>
        </div>

        {/* Valores */}
        <div className="mt-20">
          <h3 className="mb-10 text-center text-3xl font-extrabold text-slate-900">
            Nuestros valores
          </h3>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {valores.map(({ nombre, descripcion, Icono }) => (
              <article
                key={nombre}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-marca/20">
                  <Icono size={25} className="text-marca-oscuro" />
                </div>

                <h4 className="mb-3 text-xl font-bold text-slate-900">
                  {nombre}
                </h4>

                <p className="leading-7 text-slate-600">
                  {descripcion}
                </p>
              </article>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

export default Nosotros;
