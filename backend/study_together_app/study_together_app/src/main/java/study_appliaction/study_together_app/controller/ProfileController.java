package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import study_appliaction.study_together_app.entity.Profile;
import study_appliaction.study_together_app.repo.ProfileRepository;

import java.util.List;

@RestController
@RequestMapping("/api")
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
public class ProfileController {

    @Autowired
    private ProfileRepository repo;

    // ✅ SAFE AUTH METHOD
    private String getUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || auth.getName() == null || auth.getName().equals("anonymousUser")) {
            throw new RuntimeException("Unauthorized - Please login");
        }

        return auth.getName();
    }

    // ✅ SAVE / UPDATE PROFILE
    @PostMapping("/profile")
    public Profile save(@RequestBody Profile profile) {

        List<Profile> list = repo.findByEmail(profile.getEmail());

        if (!list.isEmpty()) {
            Profile existing = list.get(0);
            existing.setName(profile.getName());
            existing.setCourse(profile.getCourse());
            existing.setGoal(profile.getGoal());
            existing.setSkills(profile.getSkills());
            existing.setImage(profile.getImage());
            return repo.save(existing);
        }

        return repo.save(profile);
    }

    // 🔥 GET OTHER USERS
    @GetMapping("/profiles")
    public List<Profile> getProfiles() {
        return repo.findAll(); // 🔥 SIMPLE FIX
    }

    // 🔥 GET ALL USERS (CHAT)
    @GetMapping("/profile/all")
    public List<Profile> getAll() {
        return repo.findAll();
    }
}