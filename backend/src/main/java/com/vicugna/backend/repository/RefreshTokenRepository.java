
package com.vicugna.backend.repository;

import com.vicugna.backend.entity.RefreshToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository
        extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);

    @Modifying
    @Query("""
        UPDATE RefreshToken rt
        SET rt.revocado = true
        WHERE rt.usuario.id = :usuarioId
          AND rt.revocado = false
    """)
    int revocarTodosPorUsuario(
            @Param("usuarioId") Long usuarioId
    );
}
