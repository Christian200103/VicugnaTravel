
package com.vicugna.backend.service.impl;

import com.vicugna.backend.service.ComprobanteService;
import com.vicugna.backend.dto.reserva.ReservaResponse;
import com.vicugna.backend.entity.Reserva;
import com.vicugna.backend.mapper.ReservaMapper;
import com.vicugna.backend.repository.ReservaRepository;
import com.vicugna.backend.repository.PagoRepository;
import com.vicugna.backend.enums.EstadoPago;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;

@Service
public class ComprobanteServiceImpl implements ComprobanteService {

    private final ReservaRepository reservaRepository;
    private final ReservaMapper reservaMapper;
    private final PagoRepository pagoRepository;

    // Constructor
    public ComprobanteServiceImpl(
            ReservaRepository reservaRepository,
            ReservaMapper reservaMapper,
            PagoRepository pagoRepository) {

        this.reservaRepository = reservaRepository;
        this.reservaMapper = reservaMapper;
        this.pagoRepository = pagoRepository;
    }

    // PDF de prueba
    @Override
    public byte[] generarPdfPrueba() {

        try {
            ByteArrayOutputStream salida =
                    new ByteArrayOutputStream();

            Document documento = new Document();

            PdfWriter.getInstance(documento, salida);

            documento.open();

            documento.add(new Paragraph("VICUGNA TRAVEL"));

            documento.add(new Paragraph(
                    "COMPROBANTE DE RESERVA TURISTICA"
            ));

            documento.add(new Paragraph(
                    "Sistema Web de Reservas Turisticas"
            ));

            documento.add(new Paragraph(
                    "Documento de prueba"
            ));

            documento.close();

            return salida.toByteArray();

        } catch (DocumentException e) {
            throw new IllegalStateException(
                    "Error al generar el PDF de prueba", e
            );
        }
    }

    // PDF con los datos reales de la reserva
    @Override
    @Transactional(readOnly = true)
    public byte[] generarComprobanteReserva(Long reservaId) {

        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Reserva no encontrada"
                ));

        ReservaResponse datos = reservaMapper.toResponse(reserva);

        // Calcular pagos registrados
        BigDecimal montoPagado =
                pagoRepository.sumarPagosPorReservaYEstado(
                        reservaId,
                        EstadoPago.REGISTRADO
                );

        BigDecimal saldoPendiente =
                datos.getMontoTotal().subtract(montoPagado);

        if (saldoPendiente.compareTo(BigDecimal.ZERO) < 0) {
            saldoPendiente = BigDecimal.ZERO;
        }

        try {
            ByteArrayOutputStream salida =
                    new ByteArrayOutputStream();

            Document documento = new Document();

            PdfWriter.getInstance(documento, salida);

            documento.open();

            // Fuentes
            Font titulo = new Font(
                    Font.HELVETICA, 18, Font.BOLD
            );

            Font subtitulo = new Font(
                    Font.HELVETICA, 13, Font.BOLD
            );

            // Encabezado
            Paragraph encabezado = new Paragraph(
                    "VICUGNA TRAVEL", titulo
            );

            encabezado.setAlignment(Element.ALIGN_CENTER);
            documento.add(encabezado);

            Paragraph descripcion = new Paragraph(
                    "CONSTANCIA DE RESERVA TURISTICA",
                    subtitulo
            );

            descripcion.setAlignment(Element.ALIGN_CENTER);
            documento.add(descripcion);

            documento.add(new Paragraph(" "));

            // Informacion de la reserva
            documento.add(new Paragraph(
                    "Codigo de reserva: " + datos.getCodigo()
            ));

            documento.add(new Paragraph(
                    "Estado: " + datos.getEstado()
            ));

            documento.add(new Paragraph(
                    "Fecha de registro: " + datos.getFechaReserva()
            ));

            documento.add(new Paragraph(" "));

            documento.add(new Paragraph(
                    "DATOS DE LA RESERVA", subtitulo
            ));

            documento.add(new Paragraph(" "));

            // Tabla de datos
            PdfPTable tabla = new PdfPTable(2);
            tabla.setWidthPercentage(100);

            agregarFila(
                    tabla,
                    "Cliente",
                    datos.getNombreCliente()
            );

            agregarFila(
                    tabla,
                    "Tour",
                    datos.getNombreTour()
            );

            agregarFila(
                    tabla,
                    "Fecha de salida",
                    String.valueOf(datos.getFechaSalida())
            );

            agregarFila(
                    tabla,
                    "Hora de salida",
                    String.valueOf(datos.getHoraSalida())
            );

            agregarFila(
                    tabla,
                    "Cantidad de personas",
                    String.valueOf(datos.getCantidadPersonas())
            );

            agregarFila(
                    tabla,
                    "Precio por persona",
                    "S/ " + datos.getPrecioUnitario()
            );

            agregarFila(
                    tabla,
                    "Monto total",
                    "S/ " + datos.getMontoTotal()
            );

            documento.add(tabla);

            // Resumen economico
            documento.add(new Paragraph(" "));

            documento.add(new Paragraph(
                    "RESUMEN ECONOMICO", subtitulo
            ));

            documento.add(new Paragraph(" "));

            PdfPTable tablaPagos = new PdfPTable(2);
            tablaPagos.setWidthPercentage(100);

            agregarFila(
                    tablaPagos,
                    "Monto total",
                    "S/ " + datos.getMontoTotal()
            );

            agregarFila(
                    tablaPagos,
                    "Monto pagado",
                    "S/ " + montoPagado
            );

            agregarFila(
                    tablaPagos,
                    "Saldo pendiente",
                    "S/ " + saldoPendiente
            );

            documento.add(tablaPagos);

            // Pie del comprobante
            documento.add(new Paragraph(" "));

            documento.add(new Paragraph(
                    "Documento generado por VICUGNA TRAVEL."
            ));

            documento.add(new Paragraph(
                    "Esta constancia no constituye " +
                    "un comprobante tributario."
            ));

            documento.close();

            return salida.toByteArray();

        } catch (DocumentException e) {
            throw new IllegalStateException(
                    "Error al generar el comprobante PDF", e
            );
        }
    }

    // Metodo auxiliar para las tablas
    private void agregarFila(
            PdfPTable tabla,
            String etiqueta,
            String valor) {

        tabla.addCell(
                new PdfPCell(new Paragraph(etiqueta))
        );

        tabla.addCell(
                new PdfPCell(
                        new Paragraph(
                                valor != null ? valor : "-"
                        )
                )
        );
    }
}
