import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "../styles/rooms.css";

function Rooms() {

  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");

  const currentUser = localStorage.getItem("email");

  // =========================
  // LOAD ROOMS
  // =========================

  useEffect(() => {

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    fetchRooms();

  }, []);

  // =========================
  // FETCH ROOMS
  // =========================

  const fetchRooms = async () => {

    try {

      const res = await api.get("/api/rooms");

      setRooms(res.data);

    } catch (err) {

      console.log("FETCH ERROR:", err.response || err);
    }
  };

  // =========================
  // CREATE ROOM
  // =========================

  const createRoom = async () => {

    if (!roomName.trim()) return;

    try {

      await api.post("/api/rooms", {
        name: roomName,
      });

      setRoomName("");

      fetchRooms();

    } catch (err) {

      console.log("CREATE ERROR:", err.response || err);

      alert("❌ Room creation failed");
    }
  };

  // =========================
  // JOIN ROOM
  // =========================

  const joinRoom = async (room) => {

    try {

      const res = await api.post(`/api/rooms/join/${room.id}`);

      console.log(res.data);

      // ❌ ROOM FULL
      if (res.data === "Room is full") {

        alert("❌ Room already has 100 students");

        return;
      }

      // ✅ FETCH UPDATED ROOM
      const updatedRooms = await api.get("/api/rooms");

      setRooms(updatedRooms.data);

      // ✅ FIND UPDATED ROOM
      const updatedRoom = updatedRooms.data.find(
        (r) => r.id === room.id
      );

      // ✅ SAVE UPDATED ROOM
      localStorage.setItem(
        "activeRoom",
        JSON.stringify(updatedRoom)
      );

      navigate("/messages");

    } catch (err) {

      console.log("JOIN ERROR:", err.response || err);

      alert("❌ Failed to join room");
    }
  };

  // =========================
  // DELETE ROOM
  // =========================

  const deleteRoom = async (room) => {

    try {

      const res = await api.delete(`/api/rooms/${room.id}`);

      if (res.data !== "Room deleted") {

        alert(res.data);

        return;
      }

      fetchRooms();

    } catch (err) {

      console.log("DELETE ERROR:", err.response || err);
    }
  };

  // =========================
  // UI
  // =========================

  return (

    <div className="rooms-page">

      <h2>📚 Study Rooms</h2>

      {/* CREATE ROOM */}

      <div className="create-box">

        <input
          placeholder="Create new room..."
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        />

        <button onClick={createRoom}>
          Create
        </button>

      </div>

      {/* ROOM LIST */}

      <div className="rooms-grid">

        {rooms.map((room) => (

          <div key={room.id} className="room-card">

            <h3>{room.name}</h3>

            <p>Room ID: {room.id}</p>

            <p>👤 Created by: {room.createdBy}</p>

            <p>
              👥 Members: {room.memberCount}/{room.maxMembers}
            </p>

            {/* JOIN */}

            <button onClick={() => joinRoom(room)}>
              Join Room
            </button>

            {/* DELETE */}

            {room.createdBy?.toLowerCase() ===
              currentUser?.toLowerCase() && (

              <button
                className="delete-btn"
                onClick={() => deleteRoom(room)}
              >
                Delete
              </button>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}

export default Rooms;