package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.Connection;

import java.util.List;

public interface ConnectionRepo extends JpaRepository<Connection, Long> {

    List<Connection> findByUser1OrUser2(String u1, String u2);
}