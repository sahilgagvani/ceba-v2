package com.oxaro.database.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


/**
 * This Service class give access to all the DB repositories and the environment
 */
@Service
@Slf4j
public class DatabaseAccess {

    public final Environment env;
    public final RestTemplate restTemplate; // To call external WebServices

    public DatabaseAccess(Environment env, RestTemplate restTemplate) {

        this.env = env;
        this.restTemplate = restTemplate;
    }


}

