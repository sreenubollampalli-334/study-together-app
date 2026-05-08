package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import study_appliaction.study_together_app.entity.Feedback;
import study_appliaction.study_together_app.repo.FeedbackRepository;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackRepository repo;

    // ✅ SUBMIT FEEDBACK
    @PostMapping
    public Feedback saveFeedback(@RequestBody Feedback feedback) {

        if (feedback.getFeedback() == null || feedback.getFeedback().isEmpty()) {
            throw new RuntimeException("Feedback cannot be empty");
        }

        if (feedback.getRating() < 1 || feedback.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        return repo.save(feedback);
    }

    // 🔥 OPTIONAL: GET ALL FEEDBACK
    @GetMapping
    public List<Feedback> getAll() {
        return repo.findAll();
    }
}