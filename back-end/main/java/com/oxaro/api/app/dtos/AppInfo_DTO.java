package com.oxaro.api.app.dtos;

import com.oxaro.api.support.dtos.Response_DTO;
import com.oxaro.database.services.DatabaseAccess;
import lombok.NoArgsConstructor;


/**
 * This class contains the app info sent to the REACT application
 */
@NoArgsConstructor
public class AppInfo_DTO extends Response_DTO {

    public String Version;  // Version of the code
    public String NET_ENV;  // Value of the NET_ENV from the OS system

    /**
     * creates the app info dto from the given environment object
     */
    public AppInfo_DTO(DatabaseAccess db) {
        Version = db.env.getProperty("application.version");
        NET_ENV = System.getenv("NET_ENV");

    }

}