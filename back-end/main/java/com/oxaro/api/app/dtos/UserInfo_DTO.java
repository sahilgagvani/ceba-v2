package com.oxaro.api.app.dtos;

import com.oxaro.api.support.dtos.Response_DTO;
import com.oxaro.support.Text;
import lombok.NoArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;

/**
 * DTO class containing the user info sent to the REACT application
 */
@NoArgsConstructor
public class UserInfo_DTO extends Response_DTO {
    public String Username;

    public boolean IsAuthenticated; // true if authenticated
    public String Roles; // All users roles separated by a ;
    public String DisplayName; // Display nameof the user


    /**
     * creates the user info dto from the given authentication user object
     */

    public UserInfo_DTO(Authentication user) {

        Object principal = user.getPrincipal();
        if (principal instanceof String) {
            Username = principal.toString();
        }
        if (principal instanceof User) {
            User userDetails = (User) principal;
            Username = userDetails.getUsername();
            IsAuthenticated = user.isAuthenticated();
            DisplayName = userDetails.getUsername();

            StringBuilder sb = new StringBuilder();
            for (var auth : userDetails.getAuthorities()) sb.append(auth.getAuthority()).append(",");
            Roles = Text.trim(sb.toString(), ',');
            DisplayName = Username;
        }

    }
}