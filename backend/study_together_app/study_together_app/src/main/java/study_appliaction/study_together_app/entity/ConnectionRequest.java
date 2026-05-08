package study_appliaction.study_together_app.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ConnectionRequest {

    @Id
    @GeneratedValue
    private Long id;

    private String senderEmail;
    private String receiverEmail;
    private String status; // PENDING / ACCEPTED
}