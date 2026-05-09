import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/conversation.css";

function Conversation() {

  const { email } = useParams();

  const navigate = useNavigate();

  const myEmail = localStorage.getItem("email");

  const [partner, setPartner] = useState(null);

  const [messages, setMessages] = useState([]);

  const [text, setText] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  // =========================
  // LOAD
  // =========================

  useEffect(() => {

    if (!email) return;

    loadPartner();

    loadMessages();

    // ✅ AUTO REFRESH CHAT
    const interval =
      setInterval(() => {

        loadMessages();

      }, 2000);

    return () => clearInterval(interval);

  }, [email]);

  // =========================
  // LOAD PARTNER
  // =========================

  const loadPartner = async () => {

    try {

      const res =
        await api.get("/profile/all");

      const user =
        res.data.find(
          p => p.email === email
        );

      setPartner(user);

    } catch (err) {

      console.log(
        "PARTNER ERROR:",
        err
      );
    }
  };

  // =========================
  // LOAD MESSAGES
  // =========================

  const loadMessages = async () => {

    try {

      const res = await api.get(

        `/private-messages?user1=${myEmail}&user2=${email}`

      );

      // ✅ DEBUG
      console.log(
        "PRIVATE CHAT:",
        res.data
      );

      setMessages(res.data);

    } catch (err) {

      console.log(
        "LOAD MESSAGE ERROR:",
        err.response || err
      );
    }
  };

  // =========================
  // SEND TEXT
  // =========================

  const sendMessage = async () => {

    if (!text.trim()) return;

    try {

      await api.post(

        "/private-messages/send",

        {
          senderEmail: myEmail,

          receiverEmail: email,

          content: text
        }
      );

      // ✅ CLEAR INPUT
      setText("");

      // ✅ REFRESH CHAT
      loadMessages();

    } catch (err) {

      console.log(
        "SEND ERROR:",
        err.response || err
      );
    }
  };

  // =========================
  // SEND FILE
  // =========================

  const sendFile = async (fileToSend) => {

    const file =
      fileToSend || selectedFile;

    if (!file) return;

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "senderEmail",
        myEmail
      );

      formData.append(
        "receiverEmail",
        email
      );

      await api.post(

        "/private-messages/send-file",

        formData,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      // ✅ CLEAR FILE
      setSelectedFile(null);

      // ✅ REFRESH
      loadMessages();

    } catch (err) {

      console.log(
        "FILE ERROR:",
        err.response || err
      );
    }
  };

  // =========================
  // DELETE MESSAGE
  // =========================

  const deleteMessage = async (id) => {

    try {

      await api.delete(

        `/private-messages/delete/${id}`

      );

      loadMessages();

    } catch (err) {

      console.log(
        "DELETE ERROR:",
        err.response || err
      );
    }
  };

  return (

    <div className="chat-page">

      {/* HEADER */}

      <div className="chat-header">

        <button
          className="back-btn"
          onClick={() =>
            navigate("/partners")
          }
        >
          ⬅ Back
        </button>

        <div className="chat-user">

          <div className="avatar">
            {partner?.name?.charAt(0) || "U"}
          </div>

          <div>

            <h4>
              {partner?.name || email}
            </h4>

            <span className="status">
              online
            </span>

          </div>

        </div>

      </div>

      {/* WARNING */}

      <div className="chat-warning">
        ⚠️ Do not share personal info
      </div>

      {/* CHAT BODY */}

      <div className="chat-body">

        {messages.length === 0 && (

          <p className="empty">
            No messages yet
          </p>

        )}

        {messages.map((msg, i) => (

          <div
            key={i}
            className={
              msg.senderEmail === myEmail
                ? "msg my-msg"
                : "msg other-msg"
            }
          >

            {/* TEXT */}

            <div>
              {msg.content}
            </div>

            {/* FILE */}

            {msg.fileUrl && (

              <a
                href={msg.fileUrl}
                target="_blank"
                rel="noreferrer"
                download
                className="private-file-link"
              >
                📎 {msg.fileName}
              </a>

            )}

            {/* DELETE */}

            {msg.senderEmail === myEmail && (

              <button
                className="delete-msg-btn"
                onClick={() =>
                  deleteMessage(msg.id)
                }
              >
                Delete
              </button>

            )}

          </div>
        ))}

      </div>

      {/* FILE PREVIEW */}

      {selectedFile && (

        <div className="private-selected-file">
          📄 {selectedFile.name}
        </div>

      )}

      {/* INPUT */}

      <div className="chat-input">

        <input
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Type message..."
          onKeyDown={(e) =>
            e.key === "Enter" &&
            sendMessage()
          }
        />

        {/* FILE BUTTON */}

        <label className="private-file-btn">

          📎

          <input
            type="file"
            hidden
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

export default Conversation;