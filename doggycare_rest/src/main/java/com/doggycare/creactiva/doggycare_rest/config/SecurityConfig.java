package com.doggycare.creactiva.doggycare_rest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configure(http))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()

                        .requestMatchers("/api/mascotas/**").permitAll()

                        .requestMatchers("/uploads/**").permitAll()

                        .requestMatchers("/api/reportes/**").permitAll()

                        .anyRequest().authenticated()
                );

        return http.build();
    }
}