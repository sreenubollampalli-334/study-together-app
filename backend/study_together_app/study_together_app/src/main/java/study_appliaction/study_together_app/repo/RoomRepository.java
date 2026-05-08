package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.Room;

public interface RoomRepository
        extends JpaRepository<Room, Long> {
}