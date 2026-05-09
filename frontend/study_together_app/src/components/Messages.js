import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/messages.css";

function Messages() {

  const navigate = useNavigate();

  const bottomRef = useRef();

  const [room, setRoom] = useState(null);

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const currentUser = localStorage.getItem("email");

  // =========================
  // LOAD ROOM
  // =========================

  useEffect(() => {

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const active =
      JSON.parse(localStorage.getItem("activeRoom"));

    if (!active) return;

    setRoom(active);

  }, []);

  // =========================
  // AUTO FETCH
  // =========================

  useEffect(() => {

    if (!room) return;

    fetchMessages(room.id);

    const interval = setInterval(() => {
      fetchMessages(room.id);
    }, 2000);

    return () => clearInterval(interval);

  }, [room]);

  // =========================
  // FETCH
  // =========================

  const fetchMessages = async (roomId) => {

    try {

      const res =
        await api.get(`/messages/${roomId}`);

      setMessages(res.data);

    } catch (err) {

      console.log("FETCH ERROR:", err);
    }
  };

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = async () => {

    if (!input.trim() || !room) return;

    try {

      const email =
        localStorage.getItem("email");

      await api.post(
        "/messages",
        {
          roomId: room.id,
          text: input,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
        {
          params: { email },
        }
      );

      setInput("");

      fetchMessages(room.id);

    } catch (err) {

      console.log("SEND ERROR:", err);
    }
  };

  // =========================
  // SEND FILE
  // =========================

  const sendFile = async (fileToSend) => {

    const file =
      fileToSend || selectedFile;

    if (!file || !room) return;

    try {

      const formData = new FormData();

      formData.append("file", file);

      formData.append("roomId", room.id);

      formData.append(
        "email",
        localStorage.getItem("email")
      );

      await api.post(
        "/messages/file",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setSelectedFile(null);

      fetchMessages(room.id);

    } catch (err) {

      console.log("FILE ERROR:", err);
    }
  };

  // =========================
  // DELETE MESSAGE
  // =========================

  const deleteMessage = async (id) => {

    try {

      await api.delete(
        `/messages/${id}`
      );

      fetchMessages(room.id);

    } catch (err) {

      console.log("DELETE ERROR:", err);
    }
  };

  if (!room) return <h2>No room selected</h2>;

  return (

    <div className="gc-container">

      {/* HEADER */}

      <div className="gc-header">

        <button
          onClick={() => navigate("/rooms")}
        >
          ⬅
        </button>

        <div>
          <h3>{room.name}</h3>
          <span>Group Chat</span>
        </div>

      </div>

      {/* CHAT */}

      <div className="gc-chat">

        {messages.map((m, i) => (

          <div
            key={i}
            className={
              m.sender === currentUser
                ? "gc-msg own"
                : "gc-msg"
            }
          >

            <div className="gc-bubble">

              <span className="gc-name">
                {m.sender}
              </span>

              {/* TEXT */}

              {m.text && (
                <p>{m.text}</p>
              )}

              {/* FILE */}

              {m.fileUrl && (

                <a
                  href={m.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="file-link"
                >
                  📎 {m.fileName}
                </a>

              )}

              {/* DELETE */}

              {m.sender === currentUser && (

                <button
                  className="delete-room-msg-btn"
                  onClick={() =>
                    deleteMessage(m.id)
                  }
                >
                   Delete
                </button>

              )}

              <span className="gc-time">
                {m.time}
              </span>

            </div>

          </div>
        ))}

        <div ref={bottomRef}></div>

      </div>

      {/* FILE PREVIEW */}

      {selectedFile && (

        <div className="selected-file">
          📄 {selectedFile.name}
        </div>

      )}

      {/* INPUT */}

      <div className="gc-input">

        <input
          placeholder="Type message..."
          value={input}
          onChange={(e) =>
            setInput(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            sendMessage()
          }
        />

        {/* FILE BUTTON */}

        <label className="file-upload-btn">

          📎

          <input
            type="file"
            onChange={(e) => {

              const file =
                e.target.files[0];

              if (!file) return;

              setSelectedFile(file);

              setTimeout(() => {
                sendFile(file);
              }, 100);
            }}
          />

        </label>

        {/* SEND */}

        <button onClick={sendMessage}>
          ➤
        </button>

      </div>

    </div>
  );
}

export default Messages;