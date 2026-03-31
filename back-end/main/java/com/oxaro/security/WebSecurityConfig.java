package com.oxaro.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll())
//                .authorizeHttpRequests(authorize -> authorize
//                        .requestMatchers("/home", "/api/app/upload2").permitAll()
//                        .requestMatchers("/api/**").permitAll()
//                        .anyRequest().authenticated()
//                )
                .csrf(AbstractHttpConfigurer::disable) // Disable CSRF protection (optional for APIs)
        ;

        return http.build();
    }
}
