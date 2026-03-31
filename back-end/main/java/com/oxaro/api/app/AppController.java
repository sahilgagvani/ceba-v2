package com.oxaro.api.app;


import com.oxaro.api.app.dtos.AppData_DTO;
import com.oxaro.api.app.dtos.RecaptchaConfigResponse;
import com.oxaro.api.support.dtos.Response_DTO;
import com.oxaro.database.services.DatabaseAccess;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

/**
 * Spring Controller to feed the global application data to React
 */
@RestController
@RequestMapping("/api/app")
@Slf4j
class AppController {
    private final DatabaseAccess db;
    private final RecaptchaConfigResponse recaptchaConfig;

    public AppController(DatabaseAccess db, RecaptchaConfigResponse recaptchaConfig) {
        this.db = db;
        this.recaptchaConfig = recaptchaConfig;
    }


    @GetMapping("")
    public ResponseEntity<String> getWelcome() {
        return ResponseEntity.ok().body("Welcome to the application API!");
    }

    @GetMapping("data")
    public ResponseEntity<AppData_DTO> getAppData() {
        AppData_DTO data = new AppData_DTO(db);
        return ResponseEntity.ok().body(data);
    }

    @GetMapping("logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        request.getSession().invalidate();
        SecurityContextHolder.clearContext();
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("about")
    public ResponseEntity<Response_DTO> getAbout(@RequestParam(name = "lang") String lang) {
        Response_DTO data = new Response_DTO();
        return ResponseEntity.ok().body(data);
    }

    @GetMapping("recaptcha-config")
    public ResponseEntity<RecaptchaConfigResponse> getRecaptchaConfig() {
        return ResponseEntity.ok().body(recaptchaConfig);
    }


}
