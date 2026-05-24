package trabajito.WebOnes.Sistema_de_administracion.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("titulo", "Dashboard");
        return "index";
    }

    @GetMapping("/proyectos")
    public String proyectos(Model model) {
        // model.addAttribute("projects", projectService.findAll());
        return "proyectos";
    }
}