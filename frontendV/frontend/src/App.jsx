
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Inicio from "./pages/Inicio";
import DetalleTour from "./pages/DetalleTour";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import MisReservas from "./pages/MisReservas";
import AdminReservas from "./pages/AdminReservas";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTours from "./pages/AdminTours";
import AdminSalidas from "./pages/AdminSalidas";
import AdminPagos from "./pages/AdminPagos";
import MiPerfil from "./pages/MiPerfil";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tours/:id" element={<DetalleTour />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="/admin/reservas" element={<AdminReservas />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/tours" element={<AdminTours />} />
          <Route path="/admin/salidas" element={<AdminSalidas />} />
          <Route path="/admin/pagos" element={<AdminPagos />} />
          <Route path="/mi-perfil" element={<MiPerfil />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
