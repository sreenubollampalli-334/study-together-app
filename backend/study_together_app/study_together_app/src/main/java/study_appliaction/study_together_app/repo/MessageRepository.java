package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.Message;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRoomId(Long roomId);
}