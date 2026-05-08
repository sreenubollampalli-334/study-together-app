package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import study_appliaction.study_together_app.entity.PrivateMessage;

import java.util.List;

public interface PrivateMessageRepo extends JpaRepository<PrivateMessage, Long> {

    @Query("SELECT m FROM PrivateMessage m WHERE " +
            "(m.senderEmail = :user1 AND m.receiverEmail = :user2) OR " +
            "(m.senderEmail = :user2 AND m.receiverEmail = :user1) " +
            "ORDER BY m.timestamp ASC")
    List<PrivateMessage> getChat(
            @Param("user1") String user1,
            @Param("user2") String user2
    );
}