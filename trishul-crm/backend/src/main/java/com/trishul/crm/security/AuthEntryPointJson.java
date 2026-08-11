package com.trishul.crm.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trishul.crm.dto.ApiResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Returns a clean JSON 401 response instead of the default HTML login redirect,
 * since the frontend is a set of static pages consuming REST APIs.
 *
 * IMPORTANT: this must use Spring Boot's auto-configured ObjectMapper bean
 * (injected below), NOT a bare `new ObjectMapper()`. A raw ObjectMapper has
 * no JavaTimeModule registered, so trying to serialize ApiResponse (which
 * has a LocalDateTime field) throws InvalidDefinitionException. Since this
 * class runs inside a Security filter (not a @RestController), that
 * exception is NOT caught by GlobalExceptionHandler — it bubbles all the
 * way up to the servlet container's default error page, producing a
 * generic 500 instead of the intended 401 JSON response.
 */
@Component
@RequiredArgsConstructor
public class AuthEntryPointJson implements AuthenticationEntryPoint {

    private final ObjectMapper mapper;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write(mapper.writeValueAsString(ApiResponse.error("Authentication required. Please login.")));
    }
}
