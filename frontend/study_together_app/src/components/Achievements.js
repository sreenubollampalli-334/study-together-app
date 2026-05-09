import { useEffect, useState } from "react";
import api from "../api";

function Achievements() {

  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ GET EMAIL CORRECTLY
  const user =
    JSON.parse(
      localStorage.getItem("userProfile")
    );

  const email = user?.email;

  // =========================
  // LOAD ACHIEVEMENTS
  // =========================

  const loadAchievements = async () => {

   if (!email) {

  console.error("EMAIL NOT FOUND");

  setLoading(false);

  return;
}

    try {

      const res = await api.get(
       `/achievements/all?email=${email}`
      );

      console.log("ACHIEVEMENTS:", res.data);

      setBadges(res.data);

    } catch (err) {

      console.error(
        "ACHIEVEMENT ERROR:",
        err
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

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

  // =========================
  // UI
  // =========================

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        Loading Achievements...
      </div>
    );
  }

  return (

    <div style={{ padding: "20px" }}>

      <h2
        style={{
          marginBottom: "20px"
        }}
      >
        🏆 Achievements
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px"
        }}
      >

        {badges.map((b, i) => {

          const percentage =
            b.requiredStreak > 0
              ? (b.progress / b.requiredStreak) * 100
              : 0;

          return (

            <div
              key={i}

              style={{
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",

                background:
                  b.unlocked
                    ? "linear-gradient(135deg,#4f8ef7,#6ee7b7)"
                    : "#e5e7eb",

                color:
                  b.unlocked
                    ? "white"
                    : "#374151",

                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)"
              }}
            >

              <div
                style={{
                  fontSize: "40px"
                }}
              >
                {b.unlocked
                  ? b.icon
                  : "🔒"}
              </div>

              <h3>{b.name}</h3>

              <p>
                {b.description}
              </p>

              {!b.unlocked && (

                <div
                  style={{
                    marginTop: "15px"
                  }}
                >

                  <small>
                    {b.progress}
                    /
                    {b.requiredStreak}
                  </small>

                  <div
                    style={{
                      height: "8px",
                      background: "#cbd5e1",
                      borderRadius: "10px",
                      marginTop: "8px",
                      overflow: "hidden"
                    }}
                  >

                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: "#4f8ef7",
                        transition: "0.5s"
                      }}
                    />

                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;