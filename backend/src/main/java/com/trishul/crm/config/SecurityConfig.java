package com.trishul.crm.config;

import com.trishul.crm.security.AccessDeniedHandlerJson;
import com.trishul.crm.security.AuthEntryPointJson;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security configuration: Session based authentication (Spring Security Form
 * Login style but driven through a JSON /login endpoint), Role Based Access
 * Control for ADMIN / SUPERVISOR / USER, and CORS enabled for the static
 * front-end which is served from a different origin.
 *
 * IMPORTANT: requestMatchers() must be called with the org.springframework
 * .http.HttpMethod enum (HttpMethod.GET / HttpMethod.DELETE / etc.) to scope
 * a rule to one HTTP method. Passing a raw String like "GET" as the first
 * argument silently resolves to the path-pattern overload instead — Spring
 * then treats "GET" as a literal (never-matching) URL pattern, and the rule
 * ends up applying to EVERY HTTP method with no role restriction at all.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthEntryPointJson authEntryPointJson;
    private final AccessDeniedHandlerJson accessDeniedHandlerJson;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
            .exceptionHandling(ex -> ex
                    .authenticationEntryPoint(authEntryPointJson)
                    .accessDeniedHandler(accessDeniedHandlerJson))
        .authorizeHttpRequests(auth -> auth

    // Allow CORS preflight requests
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

    // Public endpoints
    .requestMatchers("/login", "/logout", "/error").permitAll()

                    // Everyone authenticated can READ
                    .requestMatchers(HttpMethod.GET, "/customers/**", "/leads/**", "/tasks/**",
                            "/employees/**", "/reports/**", "/settings/**", "/dashboard/**", "/me").authenticated()

                    // Create / Update on customers, leads, tasks allowed to ADMIN, SUPERVISOR & USER
                    .requestMatchers(HttpMethod.POST, "/customers/**", "/leads/**", "/tasks/**")
                        .hasAnyRole("ADMIN", "SUPERVISOR", "USER")
                    .requestMatchers(HttpMethod.PUT, "/customers/**", "/leads/**", "/tasks/**")
                        .hasAnyRole("ADMIN", "SUPERVISOR", "USER")

                    // Employees module restricted to ADMIN & SUPERVISOR
                    .requestMatchers(HttpMethod.POST, "/employees/**").hasAnyRole("ADMIN", "SUPERVISOR")
                    .requestMatchers(HttpMethod.PUT, "/employees/**").hasAnyRole("ADMIN", "SUPERVISOR")
                    .requestMatchers(HttpMethod.DELETE, "/employees/**").hasRole("ADMIN")

                    // Delete on customers, leads, tasks restricted to ADMIN & SUPERVISOR only (NOT USER)
                    .requestMatchers(HttpMethod.DELETE, "/customers/**", "/leads/**", "/tasks/**")
                        .hasAnyRole("ADMIN", "SUPERVISOR")

                    // Settings restricted to ADMIN
                    .requestMatchers(HttpMethod.PUT, "/settings/**").hasRole("ADMIN")

                    // Report generation restricted to ADMIN & SUPERVISOR
                    .requestMatchers(HttpMethod.POST, "/reports/**").hasAnyRole("ADMIN", "SUPERVISOR")

                    .anyRequest().authenticated()
            )
            .httpBasic(basic -> basic.disable())
            .formLogin(form -> form.disable());

        return http.build();
    }

   @Bean
public CorsConfigurationSource corsConfigurationSource() {

    CorsConfiguration configuration = new CorsConfiguration();

    // Allow all Vercel deployments
    configuration.setAllowedOriginPatterns(List.of(
            "https://*.vercel.app"
    ));

    configuration.setAllowedMethods(List.of(
            "GET",
            "POST",
            "PUT",
            "DELETE",
            "OPTIONS",
            "PATCH"
    ));

    configuration.setAllowedHeaders(List.of("*"));

    configuration.setExposedHeaders(List.of("*"));

    configuration.setAllowCredentials(true);

    configuration.setMaxAge(3600L);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);

    return source;
}
}