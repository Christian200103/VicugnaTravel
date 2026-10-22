package com.vicugna.backend.repository;

import com.vicugna.backend.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    Optional<Cliente> findByDni(String dni);

    boolean existsByDni(String dni);

    Optional<Cliente> findByUsuarioId(Long usuarioId);

    List<Cliente> findByNombresContainingIgnoreCase(String nombres);

    List<Cliente> findByApellidosContainingIgnoreCase(String apellidos);

    Optional<Cliente> findByCorreoIgnoreCase(String correo);
}
