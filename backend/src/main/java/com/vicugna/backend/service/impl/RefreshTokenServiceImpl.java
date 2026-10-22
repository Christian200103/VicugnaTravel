
package com.vicugna.backend.service.impl;

import com.vicugna.backend.entity.RefreshToken;
import com.vicugna.backend.entity.Usuario;
import com.vicugna.backend.repository.RefreshTokenRepository;
import com.vicugna.backend.service.RefreshTokenService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.jwt.refresh-expiration}")
    private long refreshExpiration;

    public RefreshTokenServiceImpl(RefreshTokenRepository repository) {
        this.repository = repository;
    }

    private String generarTokenAleatorio() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String calcularHash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible", e);
        }
    }

    @Override
    @Transactional
    public String crearToken(Usuario usuario) {

        String valor = generarTokenAleatorio();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setTokenHash(calcularHash(valor));
        refreshToken.setUsuario(usuario);
        refreshToken.setFechaExpiracion(
                Instant.now().plusMillis(refreshExpiration)
        );
        refreshToken.setRevocado(false);

        repository.save(refreshToken);

        return valor;
    }

    @Override
    @Transactional(readOnly = true)
    public RefreshToken validarToken(String token) {

        RefreshToken refreshToken = repository
                .findByTokenHash(calcularHash(token))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Refresh token inválido"
                ));

        if (refreshToken.isRevocado()
                || !refreshToken.getFechaExpiracion().isAfter(Instant.now())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Refresh token expirado o revocado"
            );
        }

        return refreshToken;
    }

    @Override
    @Transactional
    public String rotarToken(RefreshToken tokenAnterior) {

        tokenAnterior.setRevocado(true);
        repository.save(tokenAnterior);

        return crearToken(tokenAnterior.getUsuario());
    }

    @Override
    @Transactional
    public void revocarToken(String token) {

        repository.findByTokenHash(calcularHash(token))
                .ifPresent(refreshToken -> {
                    refreshToken.setRevocado(true);
                    repository.save(refreshToken);
                });
    }

	@Override
	@Transactional
	public void revocarTodosPorUsuario(Long usuarioId) {
	
	    repository.revocarTodosPorUsuario(usuarioId);
	}

}
