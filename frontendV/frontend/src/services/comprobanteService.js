
import api from "./api";

const comprobanteService = {
  descargarReserva: async (reservaId, token) => {
    const response = await api.get(
      `/comprobantes/reserva/${reservaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      }
    );

    const archivo = new Blob([response.data], {
      type: "application/pdf",
    });

    const url = window.URL.createObjectURL(archivo);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = `comprobante-reserva-${reservaId}.pdf`;

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    window.setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 1000);
  },
};

export default comprobanteService;
