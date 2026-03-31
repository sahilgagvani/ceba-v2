package com.oxaro.msgraph.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TokenResponse_DTO {
    @JsonProperty("token_type")
    public String tokenType;

    @JsonProperty("expires_in")
    public Integer expiresIn;

    @JsonProperty("ext_expires_in")
    public Integer extExpiresIn;

    @JsonProperty("access_token")
    public String accessToken;
}

