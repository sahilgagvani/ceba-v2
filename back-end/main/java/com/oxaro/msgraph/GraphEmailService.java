package com.oxaro.msgraph;

import com.oxaro.api.email.dtos.WebformEmailRequest_DTO;
import com.oxaro.msgraph.dtos.TokenResponse_DTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@Slf4j
public class GraphEmailService {

    @Autowired
    private RestTemplate restTemplate;

    private String getEnv(String key) {
        String v = System.getenv(key);
        return v == null ? "" : v;
    }

    private boolean isDebug() {
        String v = getEnv("GRAPH_DEBUG_LOG_TOKEN");
        return !v.isBlank() && ("true".equalsIgnoreCase(v) || "1".equals(v));
    }

    private String tokenUrl() {
        String tenant = getEnv("GRAPHTENANT_ID");
        if (tenant.isBlank()) {
            throw new RuntimeException("GRAPHTENANT_ID not configured");
        }
        return "https://login.microsoftonline.com/" + tenant + "/oauth2/v2.0/token";
    }

    private String sendMailUrl() {
        String endpoint = getEnv("GRAPH_ENDPOINT");
        if (endpoint.isBlank()) endpoint = "https://graph.microsoft.com/v1.0";
        if (endpoint.endsWith("/")) endpoint = endpoint.substring(0, endpoint.length() - 1);
        String sender = getEnv("GRAPHEMAIL_SENDER");
        if (sender.isBlank()) throw new RuntimeException("GRAPHEMAIL_SENDER not configured");
        return endpoint + "/users/" + sender + "/sendMail";
    }

    private List<String> toRecipients() {
        List<String> recipients = new ArrayList<>();

        String raw = getEnv("GRAPHEMAIL_RECIPIENT");
        if (raw != null && !raw.isBlank()) {
            String[] parts = raw.split(",");
            for (String part : parts) {
                if (part == null) continue;
                String trimmed = part.trim();
                if (!trimmed.isBlank()) {
                    recipients.add(trimmed);
                }
            }
        }

        return recipients;
    }

    private String acquireToken() {
        String clientId = getEnv("GRAPHCLIENT_ID");
        String clientSecret = getEnv("GRAPHCLIENT_SECRET");
        String scope = getEnv("GRAPH_SCOPE");
        if (scope.isBlank()) scope = "https://graph.microsoft.com/.default";
        if (clientId.isBlank()) throw new RuntimeException("GRAPHCLIENT_ID not configured");
        if (clientSecret.isBlank()) throw new RuntimeException("GRAPHCLIENT_SECRET not configured");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "client_credentials");
        form.add("client_id", clientId);
        form.add("client_secret", clientSecret);
        form.add("scope", scope);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        ResponseEntity<TokenResponse_DTO> response = restTemplate.postForEntity(tokenUrl(), request, TokenResponse_DTO.class);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null || response.getBody().accessToken == null) {
            throw new RuntimeException("Unable to acquire access token");
        }
        String token = response.getBody().accessToken;
        if (isDebug()) {
            log.warn("GRAPH_DEBUG_LOG_TOKEN enabled.");
        } else {
            if (token.length() > 12) {
                String masked = token.substring(0, 4) + "..." + token.substring(token.length() - 8);
                log.debug("Access token acquired (masked): {}", masked);
            } else {
                log.debug("Access token acquired (short)");
            }
        }
        return token;
    }

    private String labelContactBy(String v) {
        if (v == null) return "";
        return switch (v) {
            case "contact-email" -> "Email";
            case "contact-telephone" -> "Telephone";
            default -> v;
        };
    }

    private String labelContactTime(String v) {
        if (v == null) return "";
        return switch (v) {
            case "contact-time-morning" -> "In the morning";
            case "contact-time-afternoon" -> "In the afternoon";
            default -> v;
        };
    }

    private String labelReason(String v) {
        if (v == null) return "";
        return switch (v) {
            case "ceba-id-recovery" -> "CEBA ID recovery";
            case "loan-balance-inquiry" -> "Loan balance inquiry";
            case "change-in-business-details" -> "Change in business details and ownership";
            case "payments-and-collections" -> "Payments and collections inquiry";
            case "other" -> "Other";
            default -> v;
        };
    }

    private String bracket(String v) {
        if (v == null) v = "";
        return "[" + v + "]";
    }

    private String buildBody(WebformEmailRequest_DTO d) {
        StringBuilder sb = new StringBuilder();
        sb.append("First Name: ").append(bracket(d.getFirstName())).append("\n\n");
        sb.append("Last Name: ").append(bracket(d.getLastName())).append("\n\n");
        sb.append("Business Name: ").append(bracket(d.getBusinessName())).append("\n\n");
        sb.append("I would like the CEBA Program to contact me by: ").append(bracket(labelContactBy(d.getContactBy()))).append("\n\n");
        sb.append("Email address: ").append(bracket(d.getEmailAddress())).append("\n\n");
        sb.append("Telephone number: ").append(bracket(d.getTelephoneNumber())).append("\n\n");
        sb.append("I would prefer the CEBA Call Centre to contact me: ").append(bracket(labelContactTime(d.getPreferCallCentreContactBy()))).append("\n\n");
        sb.append("Reason for contacting us: ").append(bracket(labelReason(d.getReasonForContactingUs()))).append("\n\n");
        sb.append("Business number: ").append(bracket(d.getBusinessNumber())).append("\n\n");
        sb.append("CEBA ID: ").append(bracket(d.getCebaId())).append("\n\n");
        sb.append("Message: ").append(bracket(d.getMessage())).append("\n");
        return sb.toString();
    }

    public void sendWebformEmail(WebformEmailRequest_DTO dto) {
        String token = acquireToken();
        List<String> recipients = toRecipients();
        if (recipients.isEmpty()) {
            throw new RuntimeException("Recipient email not configured (GRAPHEMAIL_RECIPIENT)");
        }

        Map<String, Object> message = new LinkedHashMap<>();
        message.put("subject", "Submitted CEBA-CUEC Webform");

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("contentType", "Text");
        body.put("content", buildBody(dto));
        message.put("body", body);

        List<Map<String, Object>> toRecipients = new ArrayList<>();
        for (String recipient : recipients) {
            Map<String, Object> emailAddress = new LinkedHashMap<>();
            emailAddress.put("address", recipient);
            toRecipients.add(Collections.singletonMap("emailAddress", emailAddress));
        }
        message.put("toRecipients", toRecipients);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("message", message);
        payload.put("saveToSentItems", true);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(token);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(sendMailUrl(), request, String.class);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Graph sendMail failed with status: " + response.getStatusCode());
        }
    }

    public void testToken() {
        acquireToken();
    }
}
