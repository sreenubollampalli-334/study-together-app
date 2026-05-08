package study_appliaction.study_together_app.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
public class UserAchievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @ManyToOne
    private Achievement achievement;

    private LocalDate unlockedDate;

    // getters & setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Achievement getAchievement() {
        return achievement;
    }

    public void setAchievement(Achievement achievement) {
        this.achievement = achievement;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getUnlockedDate() {
        return unlockedDate;
    }

    public void setUnlockedDate(LocalDate unlockedDate) {
        this.unlockedDate = unlockedDate;
    }
}
