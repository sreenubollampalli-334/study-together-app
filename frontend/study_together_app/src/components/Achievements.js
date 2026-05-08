import { useEffect, useState } from "react";
import api from "../api";

function Achievements() {

  const [badges, setBadges] = useState([]);

  // ✅ FIXED
  const email = localStorage.getItem("email");

 useEffect(() => {

  const loadAchievements = () => {

    if (email) {

      api.get(
        `/achievements/all?email=${email}`
      )

      .then(res => {

        setBadges(res.data);

      })

      .catch(err => {

        console.error(err);
      });
    }
  };

  // INITIAL LOAD
  loadAchievements();

  // 🔥 AUTO REFRESH
  window.addEventListener(
    "streakUpdated",
    loadAchievements
  );

  return () => {

    window.removeEventListener(
      "streakUpdated",
      loadAchievements
    );
  };

}, [email]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏆 Achievements</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3,1fr)",
        gap: "20px"
      }}>
        {badges.map((b, i) => (
          <div key={i} style={{
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
            background: b.unlocked
              ? "linear-gradient(135deg,#4f8ef7,#6ee7b7)"
              : "#ddd",
            color: b.unlocked ? "white" : "#555"
          }}>

            {/* ICON */}
            <div style={{ fontSize: "30px" }}>
              {b.unlocked ? b.icon : "🔒"}
            </div>

            <h3>{b.name}</h3>
            <p>{b.description}</p>

            {/* 🔥 PROGRESS BAR */}
            {!b.unlocked && (
              <div style={{ marginTop: "10px" }}>
                <small>
                  {b.progress} / {b.requiredStreak}
                </small>

                <div style={{
                  height: "6px",
                  background: "#ccc",
                  borderRadius: "5px",
                  marginTop: "5px"
                }}>
                  <div style={{
                    width: `${(b.progress / b.requiredStreak) * 100}%`,
                    height: "100%",
                    background: "#4f8ef7",
                    borderRadius: "5px"
                  }} />
                </div>
              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}

export default Achievements;