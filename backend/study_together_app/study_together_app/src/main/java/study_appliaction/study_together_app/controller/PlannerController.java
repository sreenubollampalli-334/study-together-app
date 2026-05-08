package study_appliaction.study_together_app.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import study_appliaction.study_together_app.entity.PlannerTask;
import study_appliaction.study_together_app.repo.PlannerRepository;

import java.util.List;

@RestController
@RequestMapping("/planner")
@CrossOrigin("*")
public class PlannerController {

    @Autowired
    private PlannerRepository repo;

    @GetMapping
    public List<PlannerTask> getTasks() {
        return repo.findAll();
    }

    @PostMapping
    public PlannerTask addTask(
            @RequestBody PlannerTask task) {

        return repo.save(task);
    }

    @PutMapping("/{id}")
    public PlannerTask updateTask(
            @PathVariable Long id,
            @RequestBody PlannerTask task) {

        task.setId(id);

        return repo.save(task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(
            @PathVariable Long id) {

        repo.deleteById(id);
    }
}
