import { useState, useEffect } from "react";
import "../styles/planner.css";
import api from "../api";

function Planner() {

  const days = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun"
  ];

  const [activeDay, setActiveDay] =
    useState("Mon");

  const [tab, setTab] =
    useState("all");

  const [tasks, setTasks] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [newTask, setNewTask] =
    useState({
      title: "",
      priority: "Medium",
      time: "",
      status: "in-progress",
      notified: false
    });

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {

    try {

      const res =
        await api.get("/planner");

      console.log(
        "TASKS:",
        res.data
      );

      setTasks(res.data);

    } catch (err) {

      console.error(
        "FETCH TASK ERROR:",
        err
      );
    }
  };

  useEffect(() => {

    fetchTasks();

    if (
      Notification.permission !==
      "granted"
    ) {

      Notification.requestPermission();
    }

  }, []);

  // =========================
  // ADD TASK
  // =========================

  const addTask = async () => {

    if (
      !newTask.title ||
      !newTask.time
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      const payload = {
        ...newTask,
        day: activeDay
      };

      console.log(
        "ADDING TASK:",
        payload
      );

      const res =
        await api.post(
          "/planner",
          payload
        );

      console.log(
        "ADD SUCCESS:",
        res.data
      );

      // REFRESH TASKS
      await fetchTasks();

      // RESET FORM
      setNewTask({
        title: "",
        priority: "Medium",
        time: "",
        status: "in-progress",
        notified: false
      });

      setShowModal(false);

    } catch (err) {

      console.error(
        "ADD TASK ERROR:",
        err
      );

      alert(
        "Failed to add task"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // COMPLETE TASK
  // =========================

  const toggleComplete =
    async (task) => {

    try {

      await api.put(
        `/planner/${task.id}`,
        {
          ...task,

          status:
            task.status ===
            "complete"

              ? "in-progress"

              : "complete"
        }
      );

      fetchTasks();

    } catch (err) {

      console.error(
        "UPDATE ERROR:",
        err
      );
    }
  };

  // =========================
  // DELETE TASK
  // =========================

  const deleteTask =
    async (id) => {

    try {

      await api.delete(
        `/planner/${id}`
      );

      fetchTasks();

    } catch (err) {

      console.error(
        "DELETE ERROR:",
        err
      );
    }
  };

  // =========================
  // FILTER TASKS
  // =========================

  const filteredTasks =
    tasks.filter(task => {

      const sameDay =
        task.day === activeDay;

      const sameTab =

        tab === "all"

          ? true

          : task.status === tab;

      return sameDay && sameTab;
    });

  return (

    <div className="planner-main">

      <h2>📅 Study Planner</h2>

      {/* DAYS */}

      <div className="date-row">

        {days.map((d) => (

          <div
            key={d}

            className={
              activeDay === d

                ? "date active"

                : "date"
            }

            onClick={() =>
              setActiveDay(d)
            }
          >

            {d}

          </div>

        ))}

      </div>

      {/* TABS */}

      <div className="tabs">

        {[
          "all",
          "in-progress",
          "complete"
        ].map(t => (

          <span
            key={t}

            className={
              tab === t

                ? "tab active"

                : "tab"
            }

            onClick={() =>
              setTab(t)
            }
          >

            {t}

          </span>

        ))}

      </div>

      {/* TASK LIST */}

      <div className="task-list">

        {filteredTasks.length === 0 && (

          <p className="empty">

            No tasks. Click ➕

          </p>
        )}

        {filteredTasks.map(task => (

          <div
            key={task.id}

            className={`task-card ${task.status}`}
          >

            <h3>
              {task.title}
            </h3>

            <div className="task-footer">

              <span
                className={`priority ${task.priority.toLowerCase()}`}
              >

                {task.priority}

              </span>

              <span>
                ⏰ {task.time}
              </span>

            </div>

            <div className="task-actions">

              <button
                onClick={() =>
                  toggleComplete(task)
                }
              >

                {task.status ===
                "complete"

                  ? "↩ Undo"

                  : "✔ Done"}

              </button>

              <button
                onClick={() =>
                  deleteTask(task.id)
                }
              >

                🗑

              </button>

            </div>

          </div>

        ))}

      </div>

      {/* FLOAT BUTTON */}

      <button
        className="fab"

        onClick={() =>
          setShowModal(true)
        }
      >

        +

      </button>

      {/* MODAL */}

      {showModal && (

        <div className="modal">

          <div className="modal-card">

            <h3>
              Add Task ({activeDay})
            </h3>

            <input
              placeholder="Task Name"

              value={newTask.title}

              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  title:
                    e.target.value
                })
              }
            />

            <select
              value={newTask.priority}

              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority:
                    e.target.value
                })
              }
            >

              <option value="High">
                🔥 High Priority
              </option>

              <option value="Medium">
                ⚡ Medium Priority
              </option>

              <option value="Low">
                🌿 Low Priority
              </option>

            </select>

            <input
              type="time"

              value={newTask.time}

              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  time:
                    e.target.value
                })
              }
            />

            <div className="modal-actions">

              <button
                onClick={addTask}

                disabled={loading}
              >

                {loading
                  ? "Adding..."
                  : "Add"}

              </button>

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >

                Cancel

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Planner;