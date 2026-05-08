import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/partners.css";

function Partners() {
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [toast, setToast] = useState(""); // ✅ NEW

  const navigate = useNavigate();

  useEffect(() => {
    loadRequests();
    loadConnections();
  }, []);

  const loadRequests = async () => {
    try {
      const myEmail = localStorage.getItem("email");
      const res = await api.get(`/api/connections/requests?email=${myEmail}`);
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadConnections = async () => {
    try {
      const myEmail = localStorage.getItem("email");
      const res = await api.get(`/api/connections?email=${myEmail}`);
      setConnections(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Accept request (UPDATED)
  const acceptRequest = async (req) => {
    try {
      await api.post(`/api/connections/accept/${req.id}`);

      // ❌ remove alert
      // alert("Connected ✅");

      // ✅ simple clean toast
      setToast("Connected successfully 🎉");
      setTimeout(() => setToast(""), 2000);

      loadRequests();
      loadConnections();

      navigate(`/chat/${req.senderEmail}`);

    } catch (err) {
      console.log(err);
    }
  };

  const getPartnerEmail = (conn) => {
    const myEmail = localStorage.getItem("email");
    return conn.user1 === myEmail ? conn.user2 : conn.user1;
  };

  return (
    <div className="partners-page">

      {/* ✅ TOAST */}
      {toast && <div className="toast">{toast}</div>}

      {/* 🔥 REQUESTS */}
      <h2>Incoming Requests 📩</h2>

      <div className="cards">
        {requests.length === 0 && <p className="empty">No requests</p>}

        {requests.map((req) => (
          <div key={req.id} className="card">
            <h3>{req.senderEmail}</h3>

            <button onClick={() => acceptRequest(req)}>
              Accept
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 PARTNERS */}
      <h2 style={{ marginTop: "30px" }}>Your Partners 👥</h2>

      <div className="cards">
        {connections.length === 0 && <p className="empty">No partners yet</p>}

        {connections.map((conn, i) => {
          const partnerEmail = getPartnerEmail(conn);

          return (
            <div key={i} className="card">
              <h3>{partnerEmail}</h3>

              <button onClick={() => navigate(`/chat/${partnerEmail}`)}>
                Message 💬
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Partners;