package study_appliaction.study_together_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import study_appliaction.study_together_app.entity.Streak;
import study_appliaction.study_together_app.repo.StreakRepository;

import java.time.LocalDate;

@Service
public class StreakService {

    @Autowired
    private StreakRepository streakRepository;

    @Autowired
    private AchievementService achievementService;

    public int updateStreak(String email) {

        Streak streak = streakRepository.findByEmail(email)
                .orElseGet(() -> {
                    Streak s = new Streak();
                    s.setEmail(email);
                    return s;
                });

        LocalDate today = LocalDate.now();
        LocalDate last = streak.getLastActiveDate();

        if (last == null) {
            streak.setCurrentStreak(1);
        }
        else if (last.equals(today.minusDays(1))) {
            streak.setCurrentStreak(streak.getCurrentStreak() + 1);
        }
        else if (!last.equals(today)) {
            streak.setCurrentStreak(1);
        }

        streak.setLastActiveDate(today);
        streakRepository.save(streak);

        // 🔥 Achievement unlock
        achievementService.unlockAchievements(email, streak.getCurrentStreak());

        return streak.getCurrentStreak();
    }

    public int getStreak(String email) {
        return streakRepository.findByEmail(email)
                .map(Streak::getCurrentStreak)
                .orElse(0);
    }
}