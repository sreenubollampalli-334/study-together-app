package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import study_appliaction.study_together_app.entity.PlannerTask;
import study_appliaction.study_together_app.repo.PlannerRepository;

import java.util.List;

@RestController
@RequestMapping("/planner")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "https://study-together-app-p79u.vercel.app"
        },
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE
        }
)
public class PlannerController {

    @Autowired
    private PlannerRepository repo;

    // =========================
    // GET ALL TASKS
    // =========================

    @GetMapping
    public List<PlannerTask> getTasks() {

        return repo.findAll();
    }

    // =========================
    // ADD TASK
    // =========================

    @PostMapping
    public PlannerTask addTask(
            @RequestBody PlannerTask task
    ) {

        System.out.println(
                "ADDING TASK: "
                        + task.getTitle()
        );

        return repo.save(task);
    }

    // =========================
    // UPDATE TASK
    // =========================

    @PutMapping("/{id}")
    public PlannerTask updateTask(

            @PathVariable Long id,

            @RequestBody PlannerTask task
    ) {

        task.setId(id);

        return repo.save(task);
    }

    // =========================
    // DELETE TASK
    // =========================

    @DeleteMapping("/{id}")
    public void deleteTask(
            @PathVariable Long id
    ) {

        repo.deleteById(id);
    }
}