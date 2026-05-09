import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import ChatBot from "./ChatBot";
import api from "../api";
import "../styles/sidebar.css";

function MainLayout() {

  const navigate = useNavigate();

  const location = useLocation();

  const [minutes, setMinutes] = useState(25);

  const [time, setTime] = useState(1500);

  const [isRunning, setIsRunning] = useState(false);

  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🔥 STREAK
  const [streak, setStreak] = useState(0);

  const [profileImage, setProfileImage] = useState("");

  // ✅ FIXED EMAIL
const user =
JSON.parse(
  localStorage.getItem("userProfile")
);

console.log("FULL USER:", user);

const email =
  user?.email ||
  user?.user?.email ||
  user?.data?.email;

console.log("FINAL EMAIL:", email);

  // =========================
  // THEME
  // =========================

  useEffect(() => {

    if (dark) {

      document.body.classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.body.classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );
    }

  }, [dark]);

  // =========================
  // PROFILE IMAGE
  // =========================

  useEffect(() => {

    const saved =
      JSON.parse(
        localStorage.getItem("userProfile")
      );

    if (saved && saved.image) {

      setProfileImage(saved.image);
    }

  }, []);

  // =========================
  // FETCH STREAK
  // =========================

  useEffect(() => {

    if (email) {

      api.get(
        `/streak/get?email=${email}`
      )

      .then(res => {

        setStreak(res.data);

      })

      .catch(err => {

        console.error(
          "GET STREAK ERROR:",
          err
        );
      });
    }

  }, [email]);

  // =========================
  // UPDATE STREAK
  // =========================

  const updateStreak = async () => {

  try {

    // ✅ GET LATEST USER
    const storedUser =
      JSON.parse(
        localStorage.getItem(
          "userProfile"
        )
      );

    const freshEmail =
      storedUser?.email;

    console.log(
      "UPDATING STREAK FOR:",
      freshEmail
    );

    if (!freshEmail) {

      console.error(
        "EMAIL NOT FOUND"
      );

      return;
    }

    const res =
      await api.post(
        `/streak/update?email=${encodeURIComponent(freshEmail)}`
      );

    console.log(
      "NEW STREAK:",
      res.data
    );

    // ✅ UPDATE UI
    setStreak(res.data);

    // ✅ REFRESH ACHIEVEMENTS
    window.dispatchEvent(
      new Event("streakUpdated")
    );

  } catch (err) {

    console.error(
      "UPDATE STREAK ERROR:",
      err.response?.data || err
    );
  }
};

  // =========================
  // TIMER
  // =========================

 useEffect(() => {

  let timer;

  if (isRunning) {

    timer = setInterval(() => {

      setTime(prev => {

        // SESSION COMPLETE
        if (prev <= 1) {

          clearInterval(timer);

          setIsRunning(false);

          // 🔥 UPDATE STREAK
          updateStreak();

          setTimeout(() => {

            alert(
              "🎉 Session Completed!"
            );

            setTime(minutes * 60);

          }, 100);

          return 0;
        }

        return prev - 1;

      });

    }, 1000);
  }

  return () => clearInterval(timer);

}, [isRunning, minutes]);

  // =========================
  // RESET TIMER
  // =========================

  useEffect(() => {

    setTime(minutes * 60);

  }, [minutes]);

  // =========================
  // FORMAT TIME
  // =========================

  const formatTime = () => {

    const min =
      Math.floor(time / 60);

    const sec =
      time % 60;

    return `${min}:${
      sec < 10 ? "0" : ""
    }${sec}`;
  };

  // =========================
  // PROGRESS
  // =========================

  const progress =
    minutes > 0

      ? (
          (
            minutes * 60 - time
          ) /

          (minutes * 60)

        ) * 100

      : 0;

  // =========================
  // MENU
  // =========================

  const menu = [

    {
      icon: "🏠",
      label: "Dashboard",
      path: "/dashboard"
    },

    {
      icon: "📚",
      label: "Rooms",
      path: "/rooms"
    },

    {
      icon: "📅",
      label: "Planner",
      path: "/planner"
    },

    {
      icon: "👥",
      label: "Partners",
      path: "/partners"
    },

    {
      icon: "🏆",
      label: "Achievements",
      path: "/achievements"
    },

   {
  icon: "🚀",
  label: "Learn Skills",
  path: "/learn-skills"
}
  ];

  return (
    <>

      {![
        "/planner",
        "/feedback",
        "/messages",
        "/rooms",
        "/games",
        "/study",
        "/partners",
        "/achievements"
      ].includes(location.pathname)

      &&

      !location.pathname.startsWith("/chat")

      &&

      <ChatBot />}

      <div
        style={{
          display: "flex",
          minHeight: "100vh"
        }}
      >

        {/* SIDEBAR */}

        <div className="sidebar">

          {menu.map((item, index) => (

            <div
              key={index}

              onClick={() =>
                navigate(item.path)
              }

              className={`sidebar-item ${
                location.pathname === item.path
                  ? "active"
                  : ""
              }`}
            >

              <span className="icon">
                {item.icon}
              </span>

              <span className="label">
                {item.label}
              </span>

            </div>
          ))}

        </div>

        {/* MAIN */}

        <div style={{ flex: 1 }}>

          {/* TOPBAR */}

          <div
            style={{
              height: "70px",

              background:
                dark
                  ? "#1e293b"
                  : "#ffffff",

              color:
                dark
                  ? "#e2e8f0"
                  : "#1e293b",

              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              padding: "0 20px",

              boxShadow:
                "0 4px 10px rgba(0,0,0,0.05)",

              borderRadius: "10px",

              margin: "10px",

              transition: "0.3s"
            }}
          >

            {/* TIMER */}

            <div>

              <div className="timer-box">

                <input
                  type="number"

                  value={minutes}

                  onChange={(e) =>
                    setMinutes(
                      Math.max(
                        1,
                        Number(
                          e.target.value
                        )
                      )
                    )
                  }

                  className="timer-input"
                />

                <span className="timer-display">
                  ⏱️ {formatTime()}
                </span>

                <button
                  onClick={() =>
                    setIsRunning(
                      !isRunning
                    )
                  }

                  className={`timer-btn ${
                    isRunning
                      ? "stop"
                      : "start"
                  }`}
                >
                  {isRunning
                    ? "Pause"
                    : "Start"}
                </button>

                <button
                  onClick={() =>
                    setTime(
                      minutes * 60
                    )
                  }

                  className="timer-btn reset"
                >
                  Reset
                </button>

                {/* 🔥 STREAK */}

                <span className="timer-stat">
                  🔥 {streak}
                </span>

              </div>

              {isRunning && (

                <div className="progress-container">

                  <div
                    className="progress-bar"

                    style={{
                      width: `${progress}%`
                    }}
                  ></div>

                </div>
              )}

            </div>

            {/* THEME */}

            <div
              onClick={() =>
                setDark(prev => !prev)
              }

              className="theme-toggle"
            >

              <div
                className={`toggle-circle ${
                  dark ? "dark" : ""
                }`}
              >

                {dark ? "🌙" : "🌞"}

              </div>

            </div>

            {/* PROFILE */}

            <img
              src={
                profileImage ||
                "https://via.placeholder.com/40"
              }

              alt="profile"

              onClick={() =>
                navigate("/feedback")
              }

              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                cursor: "pointer",
                border:
                  "2px solid #4F8EF7",
              }}
            />

          </div>

          <div style={{ padding: "20px" }}>
            <Outlet />
          </div>

        </div>

      </div>

    </>
  );
}

export default MainLayout;