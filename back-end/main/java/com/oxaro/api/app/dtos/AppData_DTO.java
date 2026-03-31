package com.oxaro.api.app.dtos;

import com.oxaro.api.support.dtos.Response_DTO;
import com.oxaro.database.services.DatabaseAccess;
import lombok.NoArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * This class contains the app data sent to the REACT application
 */
@NoArgsConstructor
public class AppData_DTO extends Response_DTO {

    public AppInfo_DTO AppInfo;
    public UserInfo_DTO UserInfo;
    public AppConfig_DTO AppConfig;

    public AppData_DTO(DatabaseAccess db) {
        AppInfo = new AppInfo_DTO(db);
        UserInfo = new UserInfo_DTO(SecurityContextHolder.getContext().getAuthentication());
        AppConfig = new AppConfig_DTO(db);
    }

}