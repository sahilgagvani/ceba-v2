package com.oxaro.api.app.dtos;

import com.oxaro.database.services.DatabaseAccess;
import lombok.NoArgsConstructor;

/**
 * This class contains the app info sent to the REACT application
 */
@NoArgsConstructor
public class AppConfig_DTO {
    public String ConfigName;
    public String graphClientId;
    public String graphTenantId;
    public String graphEndpoint;

    public AppConfig_DTO(DatabaseAccess db) {
        // 
    }

    private String getEnv(String key) {
        String v = System.getenv(key);
        return v == null ? "" : v;
    }
}
