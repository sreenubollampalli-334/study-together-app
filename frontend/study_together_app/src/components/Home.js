import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Study Together</h1>
          <p>
            Connect with students, stay focused, and achieve your goals faster
            through collaborative learning.
          </p>

          <button onClick={() => navigate("/study")}>
            Start Studying
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <h3>🧠 Stay Focused</h3>
          <p>Study with real partners and avoid distractions.</p>
        </div>

        <div className="feature">
          <h3>🤝 Collaborate</h3>
          <p>Learn concepts faster by discussing with others.</p>
        </div>

        <div className="feature">
          <h3>📈 Be Consistent</h3>
          <p>Build daily study habits with accountability.</p>
        </div>
      </section>

    
     

    </div>
  );
}

export default Home;