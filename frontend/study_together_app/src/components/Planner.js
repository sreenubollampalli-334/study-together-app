import { useState, useEffect } from "react";
import "../styles/planner.css";

import api from "../api";

function Planner() {

  const days =
    ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const [activeDay, setActiveDay] =
    useState("Mon");

  const [tab, setTab] =
    useState("all");

  const [tasks, setTasks] =
    useState([]);

  const [showModal, setShowModal] =
    useState(false);

  const [newTask, setNewTask] =
    useState({
      title: "",
      priority: "Medium",
      time: "",
      status: "in-progress",
      notified: false
    });

  // FETCH TASKS
  const fetchTasks = async () => {

    const res =
      await api.get("/planner");

    setTasks(res.data);
  };

  useEffect(() => {

    fetchTasks();

    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

  }, []);

  // ADD TASK
  const addTask = async () => {

    if (!newTask.title || !newTask.time)
      return;

    await api.post("/planner", {
      ...newTask,
      day: activeDay
    });

    fetchTasks();

    setNewTask({
      title: "",
      priority: "Medium",
      time: "",
      status: "in-progress",
      notified: false
    });

    setShowModal(false);
  };

  // COMPLETE TASK
  const toggleComplete = async (task) => {

    await api.put(
      `/planner/${task.id}`,
      {
        ...task,
        status:
          task.status === "complete"
            ? "in-progress"
            : "complete"
      }
    );

    fetchTasks();
  };

  // DELETE TASK
  const deleteTask = async (id) => {

    await api.delete(`/planner/${id}`);

    fetchTasks();
  };

  // FILTER TASKS
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

      <div className="date-row">

        {days.map((d) => (

          <div
            key={d}
            className={
              activeDay === d
                ? "date active"
                : "date"
            }
            onClick={() => setActiveDay(d)}
          >
            {d}
          </div>

        ))}

      </div>

      <div className="tabs">

        {["all","in-progress","complete"]
          .map(t => (

          <span
            key={t}
            className={
              tab === t
                ? "tab active"
                : "tab"
            }
            onClick={() => setTab(t)}
          >
            {t}
          </span>

        ))}

      </div>

      <div className="task-list">

        {filteredTasks.length === 0 && (
          <p className="empty">
            No tasks. Click ➕
          </p>
        )}

        {filteredTasks.map((task) => (

          <div
            key={task.id}
            className={`task-card ${task.status}`}
          >

            <h3>{task.title}</h3>

            <div className="task-footer">

              <span
                className={`priority ${task.priority.toLowerCase()}`}
              >
                {task.priority}
              </span>

              <span>⏰ {task.time}</span>

            </div>

            <div className="task-actions">

              <button
                onClick={() =>
                  toggleComplete(task)
                }
              >

                {task.status === "complete"
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

      <button
        className="fab"
        onClick={() => setShowModal(true)}
      >
        +
      </button>

      {showModal && (

        <div className="modal">

          <div className="modal-card">

            <h3>Add Task ({activeDay})</h3>

            <input
              placeholder="Task Name"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  title: e.target.value
                })
              }
            />

            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value
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
                  time: e.target.value
                })
              }
            />

            <div className="modal-actions">

              <button onClick={addTask}>
                Add
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