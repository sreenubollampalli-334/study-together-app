package study_appliaction.study_together_app.repo;




import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.PlannerTask;

import java.util.List;

public interface PlannerRepository
        extends JpaRepository<PlannerTask, Long> {

    List<PlannerTask> findByStatus(String status);
}
