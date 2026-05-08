package study_appliaction.study_together_app.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import org.springframework.stereotype.Service;

import study_appliaction.study_together_app.entity.PlannerTask;
import study_appliaction.study_together_app.repo.PlannerRepository;

import java.time.Duration;
import java.time.LocalTime;

import java.util.List;

@Service
@EnableScheduling
public class PlannerScheduler {

    @Autowired
    private PlannerRepository repo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Scheduled(fixedRate = 60000) // every 1 minute
    public void checkTasks() {

        List<PlannerTask> tasks =
                repo.findByStatus("in-progress");

        LocalTime now = LocalTime.now();

        for (PlannerTask task : tasks) {

            LocalTime taskTime =
                    LocalTime.parse(task.getTime());

            long minutesLeft =
                    Duration.between(
                            now,
                            taskTime
                    ).toMinutes();

            int reminderMinutes = 0;

            // PRIORITY LOGIC
            switch (task.getPriority()) {

                case "High":
                    reminderMinutes = 30;
                    break;

                case "Medium":
                    reminderMinutes = 15;
                    break;

                case "Low":
                    reminderMinutes = 5;
                    break;
            }

            // SEND REMINDER
            if (
                    minutesLeft <= reminderMinutes
                            &&
                            minutesLeft >= 0
                            &&
                            !task.isNotified()
            ) {

                String msg =
                        "⚠️ "
                                + task.getPriority().toUpperCase()
                                + " Priority Task: "
                                + task.getTitle()
                                + "\nDeadline in "
                                + minutesLeft
                                + " minutes!";

                messagingTemplate.convertAndSend(
                        "/topic/notifications",
                        msg
                );

                task.setNotified(true);

                repo.save(task);
            }
           // System.out.println("SENT MESSAGE");
        }
    }

}