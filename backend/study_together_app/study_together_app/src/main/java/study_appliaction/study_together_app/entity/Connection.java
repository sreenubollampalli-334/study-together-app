package study_appliaction.study_together_app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Connection {

    @Id
    @GeneratedValue
    private Long id;

    private String user1;
    private String user2;
}