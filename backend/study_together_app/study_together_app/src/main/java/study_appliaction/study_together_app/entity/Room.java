package study_appliaction.study_together_app.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String createdBy;

    // ✅ member count
    private int memberCount = 0;

    // ✅ max members
    private int maxMembers = 100;

    // ✅ joined users
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> joinedUsers =
            new ArrayList<>();

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public int getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(int memberCount) {
        this.memberCount = memberCount;
    }

    public int getMaxMembers() {
        return maxMembers;
    }

    public void setMaxMembers(int maxMembers) {
        this.maxMembers = maxMembers;
    }

    public List<String> getJoinedUsers() {
        return joinedUsers;
    }

    public void setJoinedUsers(
            List<String> joinedUsers
    ) {
        this.joinedUsers = joinedUsers;
    }
}