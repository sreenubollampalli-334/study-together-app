package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import study_appliaction.study_together_app.dto.AchievementDTO;
import study_appliaction.study_together_app.entity.Achievement;
import study_appliaction.study_together_app.entity.UserAchievement;
import study_appliaction.study_together_app.repo.AchievementRepository;
import study_appliaction.study_together_app.repo.StreakRepository;
import study_appliaction.study_together_app.repo.UserAchievementRepository;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/achievements")
@CrossOrigin("*")
public class AchievementController {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private StreakRepository streakRepository;

    @GetMapping("/all")
    public List<AchievementDTO> getAll(@RequestParam String email) {

        List<Achievement> all = achievementRepository.findAll();
        List<UserAchievement> user = userAchievementRepository.findByEmail(email);

        int currentStreak = streakRepository.findByEmail(email)
                .map(s -> s.getCurrentStreak())
                .orElse(0);

        List<AchievementDTO> result = new ArrayList<>();

        for (Achievement a : all) {

            AchievementDTO dto = new AchievementDTO();

            dto.setName(a.getName());
            dto.setDescription(a.getDescription());
            dto.setIcon(a.getIcon());
            dto.setRequiredStreak(a.getRequiredStreak());

            boolean unlocked = user.stream()
                    .anyMatch(u -> u.getAchievement().getId().equals(a.getId()));

            dto.setUnlocked(unlocked);
            dto.setProgress(Math.min(currentStreak, a.getRequiredStreak()));

            result.add(dto);
        }

        return result;
    }
}