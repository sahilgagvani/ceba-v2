package com.oxaro.api.email;

import com.oxaro.api.email.dtos.WebformEmailRequest_DTO;
import com.oxaro.api.support.dtos.Response_DTO;
import com.oxaro.msgraph.GraphEmailService;
import com.oxaro.security.RecaptchaService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/email")
@Slf4j
public class EmailController {

    private final GraphEmailService graphEmailService;
    private final RecaptchaService recaptchaService;

    public EmailController(GraphEmailService graphEmailService, RecaptchaService recaptchaService) {
        this.graphEmailService = graphEmailService;
        this.recaptchaService = recaptchaService;
    }

    @PostMapping("/send-webform")
    public ResponseEntity<Response_DTO> sendWebform(@RequestBody WebformEmailRequest_DTO dto) {
        try {
            List<String> validationErrors = validate(dto);
            if (!validationErrors.isEmpty()) {
                String message = "Validation failed: " + String.join("; ", validationErrors);
                log.warn("Webform validation failed: {}", message);
                return ResponseEntity.badRequest().body(Response_DTO.getWithErrorMessage(message));
            }

            // Verify reCAPTCHA token
            if (!recaptchaService.verifyRecaptcha(dto.getRecaptchaToken())) {
                log.warn("reCAPTCHA verification failed for form submission");
                return ResponseEntity.badRequest().body(Response_DTO.getWithErrorMessage("reCAPTCHA verification failed. Please try again."));
            }

            graphEmailService.sendWebformEmail(dto);
            return ResponseEntity.ok(new Response_DTO("SENT"));
        } catch (Exception ex) {
            log.error("Failed to send webform email", ex);
            return ResponseEntity.badRequest().body(Response_DTO.getWithErrorMessage("Failed to send email: " + ex.getMessage()));
        }
    }

    @GetMapping("/test-token")
    public ResponseEntity<Response_DTO> testToken() {
        try {
            graphEmailService.testToken();
            return ResponseEntity.ok(new Response_DTO("TOKEN_GENERATED_AND_LOGGED"));
        } catch (Exception ex) {
            log.error("Failed to generate token", ex);
            return ResponseEntity.badRequest().body(Response_DTO.getWithErrorMessage("Failed to generate token: " + ex.getMessage()));
        }
    }

    private List<String> validate(WebformEmailRequest_DTO dto) {
        List<String> errors = new ArrayList<>();

        if (isBlank(dto.getFirstName())) {
            errors.add("First name is required.");
        }
        if (isBlank(dto.getLastName())) {
            errors.add("Last name is required.");
        }
        if (isBlank(dto.getBusinessName())) {
            errors.add("Business name is required.");
        }

        String contactBy = dto.getContactBy();
        if (isBlank(contactBy)) {
            errors.add("Preferred contact method is required.");
        } else if ("contact-email".equals(contactBy)) {
            if (isBlank(dto.getEmailAddress())) {
                errors.add("Email address is required when contact method is email.");
            } else if (!isValidEmail(dto.getEmailAddress())) {
                errors.add("Email address must be a valid email format.");
            }
        } else if ("contact-telephone".equals(contactBy)) {
            if (isBlank(dto.getTelephoneNumber())) {
                errors.add("Telephone number is required when contact method is telephone.");
            } else {
                int telephoneDigits = countDigits(dto.getTelephoneNumber());
                if (telephoneDigits != 10) {
                    errors.add("Telephone number must contain exactly 10 digits.");
                }
            }
            if (isBlank(dto.getPreferCallCentreContactBy())) {
                errors.add("Preferred contact time is required when contact method is telephone.");
            }
        } else {
            errors.add("Contact method value is invalid.");
        }

        String reason = dto.getReasonForContactingUs();
        if (isBlank(reason)) {
            errors.add("Reason for contacting us is required.");
        } else if ("ceba-id-recovery".equals(reason) || "other".equals(reason)) {
            if (isBlank(dto.getBusinessNumber())) {
                errors.add("Business number is required for the selected reason.");
            } else {
                int businessNumberDigits = countDigits(dto.getBusinessNumber());
                if (businessNumberDigits != 9) {
                    errors.add("Business number must contain exactly 9 digits.");
                }
            }
        } else {
            if (isBlank(dto.getCebaId())) {
                errors.add("CEBA ID is required for the selected reason.");
            } else {
                String cebaDigitsOnly = digitsOnly(dto.getCebaId());
                if (cebaDigitsOnly.length() != 12 || !cebaDigitsOnly.startsWith("967")) {
                    errors.add("CEBA ID must be 12 digits and start with 967.");
                }
            }
        }

        if (isBlank(dto.getMessage())) {
            errors.add("Message is required.");
        } else if (dto.getMessage().length() > 1500) {
            errors.add("Message must be 1500 characters or fewer.");
        }

        return errors;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private int countDigits(String value) {
        if (value == null) {
            return 0;
        }
        int count = 0;
        for (int i = 0; i < value.length(); i++) {
            if (Character.isDigit(value.charAt(i))) {
                count++;
            }
        }
        return count;
    }

    private String digitsOnly(String value) {
        if (value == null) {
            return "";
        }
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < value.length(); i++) {
            char c = value.charAt(i);
            if (Character.isDigit(c)) {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private boolean isValidEmail(String value) {
        if (isBlank(value)) {
            return false;
        }
        String trimmed = value.trim();
        return trimmed.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    }
}
