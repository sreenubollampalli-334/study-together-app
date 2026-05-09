// src/components/MainLayout.js

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

  // =========================
  // USER
  // =========================

  const user =
    JSON.parse(
      localStorage.getItem("userProfile")
    );

  const email = user?.email;

  console.log(
    "MAINLAYOUT EMAIL:",
    email
  );

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

    const fetchStreak = async () => {

      try {

        if (!email) return;

        const res =
          await api.get(
            `/streak/get?email=${encodeURIComponent(email)}`
          );

        console.log(
          "FETCH STREAK:",
          res.data
        );

        setStreak(res.data);

      } catch (err) {

        console.error(
          "GET STREAK ERROR:",
          err.response?.data || err
        );
      }
    };

    fetchStreak();

  }, [email]);

  // =========================
  // UPDATE STREAK
  // =========================

  const updateStreak = async () => {

    try {

      const storedUser =
        JSON.parse(
          localStorage.getItem(
            "userProfile"
          )
        );

      const freshEmail =
        storedUser?.email;

      console.log(
        "UPDATING FOR:",
        freshEmail
      );

      if (!freshEmail) return;

      const res =
        await api.post(
          `/streak/update?email=${encodeURIComponent(freshEmail)}`
        );

      console.log(
        "NEW STREAK:",
        res.data
      );

      setStreak(res.data);

      // 🔥 REFRESH ACHIEVEMENTS
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
      <Outlet />
    </>
  );
}

export default MainLayout;