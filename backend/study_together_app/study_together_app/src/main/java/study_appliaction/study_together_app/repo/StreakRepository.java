package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.Streak;

import java.util.Optional;

public interface StreakRepository extends JpaRepository<Streak, Long> {
    Optional<Streak> findByEmail(String email);
}
