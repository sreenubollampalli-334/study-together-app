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

        if (email == null || email.isEmpty()) {
            return 0;
        }

        Streak streak = streakRepository
                .findByEmail(email)
                .orElse(new Streak());

        if (streak.getEmail() == null) {
            streak.setEmail(email);
            streak.setCurrentStreak(0);
        }

        LocalDate today = LocalDate.now();
        LocalDate last = streak.getLastActiveDate();

        // FIRST LOGIN
        if (last == null) {

            streak.setCurrentStreak(1);

        }

        // CONTINUE STREAK
        else if (last.equals(today.minusDays(1))) {

            streak.setCurrentStreak(
                    streak.getCurrentStreak() + 1
            );

        }

        // SAME DAY
        else if (last.equals(today)) {

            return streak.getCurrentStreak();
        }

        // STREAK BROKEN
        else {

            streak.setCurrentStreak(1);
        }

        streak.setLastActiveDate(today);

        streakRepository.save(streak);

        // 🔥 UNLOCK ACHIEVEMENTS
        achievementService.unlockAchievements(
                email,
                streak.getCurrentStreak()
        );

        return streak.getCurrentStreak();
    }

    public int getStreak(String email) {

        return streakRepository
                .findByEmail(email)
                .map(Streak::getCurrentStreak)
                .orElse(0);
    }
}