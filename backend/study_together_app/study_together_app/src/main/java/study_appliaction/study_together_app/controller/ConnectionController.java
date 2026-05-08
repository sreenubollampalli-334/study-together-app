package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import study_appliaction.study_together_app.entity.Connection;
import study_appliaction.study_together_app.entity.ConnectionRequest;
import study_appliaction.study_together_app.repo.ConnectionRepo;
import study_appliaction.study_together_app.repo.ConnectionRequestRepo;

import java.util.List;

@RestController
@RequestMapping("/api/connections")
@CrossOrigin(origins = "http://localhost:3000")
public class ConnectionController {

    @Autowired
    private ConnectionRequestRepo requestRepo;

    @Autowired
    private ConnectionRepo connectionRepo;

    // ✅ SAFE USER (JWT + fallback)
    private String getUser(String emailFromFrontend) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null && auth.getName() != null && !auth.getName().equals("anonymousUser")) {
            return auth.getName();
        }

        // 🔥 fallback (IMPORTANT)
        return emailFromFrontend;
    }

    // 📩 SEND REQUEST
    @PostMapping("/send")
    public String send(@RequestParam String sender,
                       @RequestParam String receiver) {

        String user = getUser(sender);

        if (user.equalsIgnoreCase(receiver)) {
            return "Cannot send request to yourself";
        }

        if (requestRepo.existsBySenderEmailAndReceiverEmail(user, receiver)) {
            return "Request already sent";
        }

        ConnectionRequest r = new ConnectionRequest();
        r.setSenderEmail(user);
        r.setReceiverEmail(receiver);
        r.setStatus("PENDING");

        requestRepo.save(r);

        return "Request Sent";
    }

    // 📥 GET REQUESTS
    @GetMapping("/requests")
    public List<ConnectionRequest> getRequests(@RequestParam String email) {
        return requestRepo.findByReceiverEmailAndStatus(email, "PENDING");
    }

    // ✅ ACCEPT REQUEST
    @PostMapping("/accept/{id}")
    public String accept(@PathVariable Long id) {

        ConnectionRequest r = requestRepo.findById(id).orElse(null);

        if (r == null) return "Request not found";

        r.setStatus("ACCEPTED");
        requestRepo.save(r);

        Connection c = new Connection();
        c.setUser1(r.getSenderEmail());
        c.setUser2(r.getReceiverEmail());

        connectionRepo.save(c);

        return "Connection established";
    }

    // 👥 GET CONNECTIONS
    @GetMapping
    public List<Connection> getConnections(@RequestParam String email) {
        return connectionRepo.findByUser1OrUser2(email, email);
    }
}