
package com.vicugna.backend.service;

import com.vicugna.backend.dto.auth.AuthResponse;
import com.vicugna.backend.dto.auth.LoginRequest;
import com.vicugna.backend.dto.auth.RegistroRequest;

public interface AuthService {

    AuthResponse registrar(RegistroRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refresh(String refreshToken);

    void logout(String refreshToken);
}
