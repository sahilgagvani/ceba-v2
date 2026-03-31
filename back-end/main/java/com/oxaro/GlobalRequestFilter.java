package com.oxaro;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * This class intercept all http request made to the application for login
 * Only being used in the Package application / Useless in DEV
 */
@Slf4j
@Component
public class GlobalRequestFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        logAllAPIEntry(request.getMethod() + " " + path);

        // Special redirected to support REACT Single Page Application Router
        if (path.startsWith("/app")) request.getRequestDispatcher("/").forward(request, response);
        else filterChain.doFilter(request, response);

        log.debug("#### Leaving API: {}", path);

    }

    void logAllAPIEntry(String path) {
        try {
            var securityContext = SecurityContextHolder.getContext();
            if (securityContext != null) {
                var auth = securityContext.getAuthentication();
                if (auth != null) {
                    Object user = auth.getPrincipal();
                    if (user instanceof User) {
                        log.info("#### Calling API:{} User:{}", path, ((User) user).getUsername());
                        return;
                    }
                }
            }
        } catch (Exception ex) {
            log.warn("An error has happened in logAllAPIEntry: {}", ex.getMessage());
        }
        log.info("#### Calling API: {} with no SecurityContext", path);
    }
}
