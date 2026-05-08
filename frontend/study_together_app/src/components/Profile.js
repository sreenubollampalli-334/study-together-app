import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api"; // ✅ USE THIS (not axios)
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [goal, setGoal] = useState("");
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [image, setImage] = useState("");

  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);

  // Load local profile
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("userProfile"));
    if (saved) {
      setName(saved.name || "");
      setEmail(saved.email || "");
      setCourse(saved.course || "");
      setGoal(saved.goal || "");
      setSkills(saved.skills || []);
      setImage(saved.image || "");
    }
  }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput)) {
      setSkills([...skills, skillInput]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // ✅ Save Profile (WITH JWT)
  const saveProfile = async () => {
    const profileData = { name, email, course, goal, skills, image };

    try {
      await api.post("/profile", profileData); // 🔥 FIX

      localStorage.setItem("userProfile", JSON.stringify(profileData));
      window.dispatchEvent(new Event("profileUpdated"));

      alert("Profile saved!");
    } catch (error) {
      console.log("PROFILE ERROR:", error.response?.data || error.message);
      alert("Error saving profile");
    }
  };

  // ✅ Save Feedback (WITH JWT)
 const submitFeedback = async () => {
  if (!feedback.trim()) {
    alert("Please enter feedback");
    return;
  }

  if (rating === 0) {
    alert("Please select rating");
    return;
  }

  try {
    await api.post("/feedback", { feedback, rating });

    setFeedback("");
    setRating(0);

    alert("Feedback submitted! 🎉");

  } catch (error) {
    console.log("FEEDBACK ERROR:", error.response?.data || error.message);
    alert(error.response?.data || "Error submitting feedback");
  }
};

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="profile-wrapper">
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-image">
          <img src={image || "https://via.placeholder.com/120"} alt="profile" />
          <label className="image-overlay">
            ✏️
            <input type="file" hidden onChange={handleImage} />
          </label>
        </div>

        <h2>{name || "Your Name"}</h2>
        <p>{course || "Add your course"}</p>

        <div className="form">
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Course" value={course} onChange={(e) => setCourse(e.target.value)} />

          <select value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option value="">Goal</option>
            <option>Study Partner</option>
            <option>Doubt Solving</option>
            <option>Interview Prep</option>
          </select>
        </div>

        <div className="skills">
          <div className="skill-input">
            <input
              placeholder="Add skill"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
            />
            <button onClick={addSkill}>+</button>
          </div>

          <div className="skill-tags">
            {skills.map((s, i) => (
              <motion.span key={i} whileHover={{ scale: 1.1 }} onClick={() => removeSkill(s)}>
                {s} ✕
              </motion.span>
            ))}
          </div>
        </div>

        <button className="save-btn" onClick={saveProfile}>
          Save Profile
        </button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </motion.div>

      <motion.div
        className="feedback-card profile-feedback"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 style={{ color: "black" }}>💬 Feedback</h3>

        <textarea
          placeholder="How is your experience?"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />

        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              className={star <= rating ? "active" : ""}
            >
              ★
            </span>
          ))}
        </div>

        <button className="feedback-btn" onClick={submitFeedback}>
          Submit Feedback
        </button>
      </motion.div>
    </div>
  );
}

export default Profile;