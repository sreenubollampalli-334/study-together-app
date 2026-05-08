package study_appliaction.study_together_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import study_appliaction.study_together_app.entity.Achievement;
import study_appliaction.study_together_app.entity.UserAchievement;
import study_appliaction.study_together_app.repo.AchievementRepository;
import study_appliaction.study_together_app.repo.UserAchievementRepository;

import java.time.LocalDate;
import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    public void unlockAchievements(String email, int streak) {

        List<Achievement> list = achievementRepository.findAll();

        for (Achievement a : list) {
            if (streak >= a.getRequiredStreak()) {

                boolean exists =
                        userAchievementRepository.existsByEmailAndAchievement(email, a);

                if (!exists) {
                    UserAchievement ua = new UserAchievement();
                    ua.setEmail(email);
                    ua.setAchievement(a);
                    ua.setUnlockedDate(LocalDate.now());

                    userAchievementRepository.save(ua);
                }
            }
        }
    }
}
