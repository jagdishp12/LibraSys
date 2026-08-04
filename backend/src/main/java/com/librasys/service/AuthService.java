package com.librasys.service;

import com.librasys.dto.AuthResponse;
import com.librasys.dto.LoginRequest;
import com.librasys.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
}
