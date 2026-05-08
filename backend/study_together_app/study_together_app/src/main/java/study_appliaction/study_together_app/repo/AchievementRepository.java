package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.Achievement;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {}