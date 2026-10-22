
import { MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-2">

        <div>
          
            <div className="inline-flex rounded-lg bg-white px-3 py-2">
            <img
                src="/images/logo-vicugna.png"
                alt="Logotipo de VICUGNA TRAVEL"
                className="h-14 w-auto object-contain"
            />
            </div>

          <p className="mt-4 max-w-md text-slate-400">
            Descubre la magia de Ayacucho y disfruta de
            experiencias turísticas inolvidables.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">
            Nuestra ubicación
          </h3>

          <div className="flex items-start gap-3 text-slate-400">
            <MapPin size={20} className="shrink-0 text-marca" />
            <span>
              Portal Municipal N.° 44, Plaza Mayor,
              Ayacucho, Perú.
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-slate-800 px-6 pt-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} VICUGNA TRAVEL.
        Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
