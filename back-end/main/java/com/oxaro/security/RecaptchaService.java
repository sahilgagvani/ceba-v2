package com.oxaro.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@Slf4j
public class RecaptchaService {

    private final RestTemplate restTemplate = new RestTemplate();

    private static final String RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    private String getEnv(String key) {
        String v = System.getenv(key);
        return v == null ? "" : v;
    }

    private String getRecaptchaSecretKey() {
        return getEnv("RECAPTCHA_SECRET_KEY");
    }

    public boolean verifyRecaptcha(String recaptchaToken) {
        String secretKey = getRecaptchaSecretKey();
        
        // If no secret key is configured, skip verification (for development)
        if (secretKey == null || secretKey.trim().isEmpty()) {
            log.warn("reCAPTCHA secret key not configured - skipping verification");
            return true;
        }

        if (recaptchaToken == null || recaptchaToken.trim().isEmpty()) {
            log.warn("reCAPTCHA token is empty");
            return false;
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("secret", secretKey);
            body.add("response", recaptchaToken);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(RECAPTCHA_VERIFY_URL, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                Boolean success = (Boolean) responseBody.get("success");
                Double score = (Double) responseBody.get("score");
                
                log.debug("reCAPTCHA verification - success: {}, score: {}", success, score);
                
                // For v3 reCAPTCHA, you might want to check the score as well
                // A typical threshold is 0.5, but you can adjust based on your needs
                return Boolean.TRUE.equals(success) && (score == null || score >= 0.5);
            }

            log.warn("reCAPTCHA verification failed with status: {}", response.getStatusCode());
            return false;

        } catch (Exception e) {
            log.error("Error verifying reCAPTCHA token", e);
            return false;
        }
    }
}
