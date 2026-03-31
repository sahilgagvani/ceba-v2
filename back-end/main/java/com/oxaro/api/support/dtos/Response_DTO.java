package com.oxaro.api.support.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * This class is the base of all React API Responses
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Response_DTO {

    public String ErrorMessage; // An error has occurred if this has a value
    public String ExceptionClass; // The class of the exception that contains the error


    public String Result1; // Main value of the response. Could be a message or a code
    public String Result2;  // Parameter to include in a returned message

    public Response_DTO() {
    }

    public Response_DTO(String value) {
        Result1 = value;
    }

    public static Response_DTO getWithErrorMessage(String errorMessage) {
        Response_DTO dto = new Response_DTO();
        dto.ErrorMessage = errorMessage;
        return dto;
    }

}