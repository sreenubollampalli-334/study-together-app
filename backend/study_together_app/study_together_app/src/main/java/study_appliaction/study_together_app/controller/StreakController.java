package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import study_appliaction.study_together_app.service.StreakService;

@RestController
@RequestMapping("/streak")
@CrossOrigin(
    origins = {
        "http://localhost:3000",
        "https://study-together-app-p79u.vercel.app"
    },
    allowedHeaders = "*",
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.PUT,
        RequestMethod.DELETE
    }
)
public class StreakController {

    @Autowired
    private StreakService streakService;

    @PostMapping("/update")
    public int update(@RequestParam String email) {
        return streakService.updateStreak(email);
    }

    @GetMapping("/get")
    public int get(@RequestParam String email) {
        return streakService.getStreak(email);
    }
}