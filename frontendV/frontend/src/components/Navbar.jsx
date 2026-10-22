import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";


function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const navigate = useNavigate();

  const {
    usuario,
    autenticado,
    cerrarSesionLocal,
  } = useAuth();

  const cerrarMenu = () => setMenuAbierto(false);

  const cerrarSesion = () => {
    cerrarSesionLocal();
    cerrarMenu();
    navigate("/login", { replace: true });
  };


  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src="/images/logo-vicugna.png"
            alt="VICUGNA TRAVEL"
            className="h-14 w-auto max-w-[190px] object-contain"
          />
        </Link>


        {/* Navegación para computadoras */}
        <nav className="hidden items-center gap-6 font-medium text-slate-700 md:flex">

          <Link to="/" className="hover:text-marca-oscuro">
            Inicio
          </Link>

          {autenticado && usuario?.rol === "CLIENTE" && (
            <Link
              to="/mis-reservas"
              className="hover:text-marca-oscuro"
            >
              Mis reservas
            </Link>
          )}

          {autenticado ? (
            <span className="font-semibold text-marca-oscuro">
              Hola, {usuario?.nombres}
            </span>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-marca px-5 py-2.5 font-bold text-slate-900 hover:bg-marca-oscuro"
            >
              Iniciar sesión
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link
              to="/admin/reservas"
              className="hover:text-marca-oscuro"
            >
              Administrar reservas
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              className="hover:text-marca-oscuro"
            >
              Dashboard
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link to="/admin/tours">
              Gestionar tours
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link to="/admin/salidas">
              Gestionar salidas
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link to="/admin/pagos">
              Gestionar pagos
            </Link>
          )}
          {autenticado && (
            <Link to="/mi-perfil">
              Mi perfil
            </Link>
          )}
          
          {autenticado && (
            <button
              type="button"
              onClick={cerrarSesion}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
            >
              <LogOut size={17} />
              Cerrar sesión
            </button>
          )}

        </nav>

        {/* Botón de menú móvil */}
        <button
          type="button"
          aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuAbierto}
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden"
        >
          {menuAbierto ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Navegación para celulares */}
      {menuAbierto && (
        <nav className="flex flex-col gap-4 border-t bg-white px-6 py-5 font-medium md:hidden">

          <Link to="/" onClick={cerrarMenu}>
            Inicio
          </Link>

          <Link to="/#destinos" onClick={cerrarMenu}>
            Destinos
          </Link>

          <Link to="/#nosotros" onClick={cerrarMenu}>
            Nosotros
          </Link>

          {autenticado && usuario?.rol === "CLIENTE" && (
            <Link
              to="/mis-reservas"
              onClick={cerrarMenu}
            >
              Mis reservas
            </Link>
          )}

          {autenticado ? (
            <span className="font-semibold text-marca-oscuro">
              Hola, {usuario?.nombres}
            </span>
          ) : (
            <Link
              to="/login"
              onClick={cerrarMenu}
              className="rounded-lg bg-marca px-4 py-3 text-center"
            >
              Iniciar sesión
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link
              to="/admin/dashboard"
              onClick={cerrarMenu}
            >
              Dashboard
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link to="/admin/tours">
              Gestionar tours
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link to="/admin/salidas">
              Gestionar salidas
            </Link>
          )}
          {autenticado && usuario?.rol === "ADMIN" && (
            <Link to="/admin/pagos">
              Gestionar pagos
            </Link>
          )}
          {autenticado && (
            <Link
              to="/mi-perfil"
              onClick={cerrarMenu}
            >
              Mi perfil
            </Link>
          )}
          
          {autenticado && (
            <button
              type="button"
              onClick={cerrarSesion}
              className="flex items-center gap-2 text-left font-semibold text-red-600"
            >
              <LogOut size={18} />
              Cerrar sesión
            </button>
          )}

        </nav>
      )}
    </header>
  );
}

export default Navbar;
