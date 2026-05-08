package study_appliaction.study_together_app.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import study_appliaction.study_together_app.entity.User;
import study_appliaction.study_together_app.repo.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    // REGISTER
    public User register(User user) {

        String email = user.getEmail().trim().toLowerCase();
        user.setEmail(email);

        if (repo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        return repo.save(user);
    }

    // LOGIN
    public User login(String email, String password) {

        String cleanEmail = email.trim().toLowerCase();
        String cleanPassword = password.trim();

        return repo.findByEmail(cleanEmail)
                .filter(u -> u.getPassword().equals(cleanPassword))
                .orElse(null);
    }
}