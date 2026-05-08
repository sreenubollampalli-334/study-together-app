package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.ConnectionRequest;

import java.util.List;

public interface ConnectionRequestRepo extends JpaRepository<ConnectionRequest, Long> {

    List<ConnectionRequest> findByReceiverEmailAndStatus(String email, String status);

    boolean existsBySenderEmailAndReceiverEmail(String s, String r);
}