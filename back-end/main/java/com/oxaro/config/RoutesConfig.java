package com.oxaro.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

//lang based on window.location.pathname
@Configuration
public class RoutesConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // entry point 
        registry.addViewController("/").setViewName("forward:/index.html");

        // French paths
        registry.addViewController("/fr").setViewName("forward:/index.html");
        registry.addViewController("/fr/").setViewName("forward:/index.html");
        registry.addViewController("/fr/**").setViewName("forward:/index.html");

        // English paths
        registry.addViewController("/en").setViewName("forward:/index.html");
        registry.addViewController("/en/").setViewName("forward:/index.html");
        registry.addViewController("/en/**").setViewName("forward:/index.html");
    }
}
