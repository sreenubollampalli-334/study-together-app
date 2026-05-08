import { useEffect, useState } from "react";
import api from "../api";
import "../styles/connectionpage.css";

function StudyPage() {

  const [students, setStudents] = useState([]);
  const [requests, setRequests] = useState({});

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const res = await api.get("/api/profiles");

      // ❗ remove self
      const myEmail = localStorage.getItem("email");
      const filtered = res.data.filter(s => s.email !== myEmail);

      setStudents(filtered);

    } catch (err) {
      console.log("Load error:", err);
    }
  };

 const sendRequest = async (email) => {
  try {
    const myEmail = localStorage.getItem("email");

    await api.post(`/api/connections/send?sender=${myEmail}&receiver=${email}`);

    setRequests(prev => ({
      ...prev,
      [email]: true
    }));

  } catch (err) {
    console.log(err);
    alert("❌ Failed to send request");
  }
};

  return (
    <div className="study-page">

      <h1>Find Study Partners 👥</h1>

      {/* 🔥 IMPORTANT: ADD THIS */}
      <div className="cards">

        {students.map(s => (
          <div key={s.id} className="card">

            <h3>{s.name}</h3>
            <p>{s.course}</p>

            <div className="skills">
              {s.skills?.map((sk, i) => (
                <span key={i}>{sk}</span>
              ))}
            </div>

            <button
              onClick={() => sendRequest(s.email)}
              disabled={requests[s.email]}
            >
              {requests[s.email] ? "Sent" : "Connect"}
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

export default StudyPage;