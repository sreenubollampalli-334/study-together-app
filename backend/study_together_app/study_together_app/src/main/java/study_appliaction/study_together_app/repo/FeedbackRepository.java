package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.Feedback;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
}