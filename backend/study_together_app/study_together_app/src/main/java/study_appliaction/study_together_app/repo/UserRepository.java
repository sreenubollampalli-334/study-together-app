package study_appliaction.study_together_app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import study_appliaction.study_together_app.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}