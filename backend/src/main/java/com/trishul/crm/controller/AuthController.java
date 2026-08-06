package com.trishul.crm.controller;

import com.trishul.crm.dto.ApiResponse;
import com.trishul.crm.dto.LoginRequest;
import com.trishul.crm.dto.LoginResponse;
import com.trishul.crm.entity.User;
import com.trishul.crm.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

/**
 * Handles Login / Logout using Spring Security's AuthenticationManager and
 * persists the authenticated principal into the HTTP Session, giving us
 * Session Based Authentication with Role Based Access Control across the
 * rest of the API.
 */
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request,
                                                              HttpServletRequest httpServletRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);

        HttpSession session = httpServletRequest.getSession(true);
        session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getRole().getName().replace("ROLE_", ""),
                "Login successful"
        );

        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Object>> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

   @GetMapping("/me")
public ResponseEntity<String> me() {
    return ResponseEntity.ok("WORKING");
}
}