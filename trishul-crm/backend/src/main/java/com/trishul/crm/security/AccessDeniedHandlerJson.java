package com.trishul.crm.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trishul.crm.dto.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * IMPORTANT: uses Spring Boot's auto-configured ObjectMapper bean (injected
 * below), not a bare `new ObjectMapper()` — see AuthEntryPointJson for the
 * full explanation of why that raw instance cannot serialize the
 * LocalDateTime field on ApiResponse and causes an unhandled 500 instead
 * of a clean 403 JSON response.
 */
@Component
@RequiredArgsConstructor
public class AccessDeniedHandlerJson implements AccessDeniedHandler {

    private final ObjectMapper mapper;

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)
            throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.getWriter().write(mapper.writeValueAsString(ApiResponse.error("Access denied. Insufficient role privileges.")));
    }
}
