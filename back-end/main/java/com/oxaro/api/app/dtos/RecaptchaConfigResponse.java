package com.oxaro.api.app.dtos;

import org.springframework.stereotype.Component;

@Component
public class RecaptchaConfigResponse {
    
    private String getEnv(String key) {
        String v = System.getenv(key);
        return v == null ? "" : v;
    }
    
    public String getSiteKey() {
        return getEnv("RECAPTCHA_SITE_KEY");
    }
    
    public boolean isHasRecaptcha() {
        String siteKey = getEnv("RECAPTCHA_SITE_KEY");
        String secretKey = getEnv("RECAPTCHA_SECRET_KEY");
        return siteKey != null && !siteKey.trim().isEmpty() && 
               secretKey != null && !secretKey.trim().isEmpty();
    }
    
    // Getter for frontend compatibility
    public boolean getHasRecaptcha() {
        return isHasRecaptcha();
    }
}
