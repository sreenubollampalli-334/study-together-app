package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.Achievement;
import study_appliaction.study_together_app.entity.UserAchievement;

import java.util.List;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    boolean existsByEmailAndAchievement(String email, Achievement achievement);
    List<UserAchievement> findByEmail(String email);
}
