package com.oxaro.api.email.dtos;

import lombok.Data;

@Data
public class WebformEmailRequest_DTO {
    private String firstName;
    private String lastName;
    private String businessName;
    private String contactBy;
    private String emailAddress;
    private String telephoneNumber;
    private String preferCallCentreContactBy;
    private String reasonForContactingUs;
    private String businessNumber;
    private String cebaId;
    private String message;
    private String recaptchaToken; // Add this field for reCAPTCHA verification
}
