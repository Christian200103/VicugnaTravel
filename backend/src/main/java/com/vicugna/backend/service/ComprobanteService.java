package com.vicugna.backend.service;

public interface ComprobanteService {

    byte[] generarPdfPrueba();

    byte[] generarComprobanteReserva(Long reservaId);
}