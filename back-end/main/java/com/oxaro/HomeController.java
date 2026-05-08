package com.oxaro;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @Value("${APP_BANNER_MSG:}")
    private String bannerMsg;

    @GetMapping("/")
    public String index(Model model) {
        model.addAttribute("bannerText", bannerMsg);
        return "index";
    }
}
