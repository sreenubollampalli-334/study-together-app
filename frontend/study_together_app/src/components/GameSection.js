import { useState, useEffect } from "react";

import "../styles/gamesection.css";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GamesSection() {

  const [screen, setScreen] = useState("home");

  const [game, setGame] = useState(null);

  const [time, setTime] = useState(5);

  const [score, setScore] = useState(0);

  const startGame = (g) => {

    setGame(g);

    setScreen("play");

    setScore(0);
  };

  return (

    <div className="container">

      {/* HOME */}
      {screen === "home" && (

        <>

          <h2 className="title">
            🎮 Brain Refresh Hub
          </h2>

          {/* TIME SELECT */}
          <div className="time-select">

            {[5,10,15].map(t => (

              <button
                key={t}
                onClick={() => setTime(t)}
                className={time === t ? "active" : ""}
              >
                {t} min
              </button>

            ))}

          </div>

          {/* GAMES */}
          <div className="grid">

            <Card
              title="🧠 Memory"
              onClick={() => startGame("memory")}
            />

            <Card
              title="🔤 Word"
              onClick={() => startGame("word")}
            />

            <Card
              title="⚡ Reaction"
              onClick={() => startGame("reaction")}
            />

            <Card
              title="➗ Math"
              onClick={() => startGame("math")}
            />

            <Card
              title="🎯 Click Speed"
              onClick={() => startGame("click")}
            />

            <Card
              title="🔢 Number Order"
              onClick={() => startGame("order")}
            />

          </div>

        </>

      )}

      {/* PLAY SCREEN */}
      {screen === "play" && (

        <GamePlay
          game={game}
          time={time}
          score={score}
          setScore={setScore}
          exit={() => setScreen("home")}
        />

      )}

    </div>
  );
}

/* ================= CARD ================= */

function Card({ title, onClick }) {

  return (

    <div
      className="card-box"
      onClick={onClick}
    >
      {title}
    </div>
  );
}

/* ================= GAME PLAY ================= */

function GamePlay({
  game,
  time,
  score,
  setScore,
  exit
}) {

  const total = time * 60;

  const [t, setT] = useState(total);

  useEffect(() => {

    // 🔔 REQUEST NOTIFICATION PERMISSION
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // ⏰ TIME FINISHED
    if (t <= 0) {

      // 🔊 PLAY SOUND
      const sound =
        new Audio("/sounds/alert.mp3");

      sound.play()
        .catch(err =>
          console.log("Audio Error:", err)
        );

      // 💬 MESSAGES
      const messages = [

        "📚 Break over! Time to focus again 🚀",

        "💪 Champions return to study after refresh!",

        "🔥 Your goals are waiting. Let's study!",

        "🧠 Brain refreshed successfully!",

        "⚡ Time to complete your tasks!",

        "🎯 Stay consistent. Small progress matters!",

        "🏆 Future topper mode activated!"
      ];

      const randomMessage =
        messages[
          Math.floor(Math.random() * messages.length)
        ];

      // 🔥 TOAST
      toast.success(randomMessage, {

        position: "top-center",

        autoClose: 4000,

        theme: "dark"
      });

      // 🔔 BROWSER NOTIFICATION
      if (Notification.permission === "granted") {

        new Notification(
          "🎮 Game Session Finished",
          {
            body: randomMessage,

            icon:
              "https://cdn-icons-png.flaticon.com/512/686/686589.png"
          }
        );
      }

      // ⏳ EXIT AFTER DELAY
      setTimeout(() => {
        exit();
      }, 1500);

      return;
    }

    // ⏱ TIMER
    const id =
      setInterval(() => {
        setT(x => x - 1);
      }, 1000);

    return () => clearInterval(id);

  }, [t]);

  return (

    <div className="play-container">

      {/* HEADER */}
      <div className="header-bar">

        <button
          className="back-btn"
          onClick={exit}
        >
          ← Back
        </button>

        <div className="hud">

          <span>
            ⏱ {Math.floor(t / 60)}:
            {t % 60 < 10 ? "0" : ""}
            {t % 60}
          </span>

          <span>
            ⭐ {score}
          </span>

        </div>

      </div>

      {/* GAMES */}

      {game === "memory" &&
        <Memory setScore={setScore} />
      }

      {game === "word" &&
        <Word setScore={setScore} />
      }

      {game === "reaction" &&
        <Reaction setScore={setScore} />
      }

      {game === "math" &&
        <MathGame setScore={setScore} />
      }

      {game === "click" &&
        <ClickGame setScore={setScore} />
      }

      {game === "order" &&
        <OrderGame setScore={setScore} />
      }

    </div>
  );
}

/* ================= MEMORY ================= */

function Memory({ setScore }) {

  const arr = [
    "🍎","🍌","🍇","🍒",
    "🍎","🍌","🍇","🍒"
  ];

  const [flip,setFlip] = useState([]);

  const click = i => {

    if (
      flip.length === 2
      || flip.includes(i)
    ) return;

    const f = [...flip, i];

    setFlip(f);

    if (f.length === 2) {

      if (arr[f[0]] === arr[f[1]]) {
        setScore(s => s + 10);
      }

      setTimeout(() => setFlip([]), 600);
    }
  };

  return (

    <div className="mini-grid">

      {arr.map((v,i) => (

        <div
          key={i}
          onClick={() => click(i)}
          className="tile"
        >
          {flip.includes(i) ? v : "?"}
        </div>

      ))}

    </div>
  );
}

/* ================= WORD ================= */

function Word({ setScore }) {

  const words = ["REACT","JAVA","ARRAY"];

  const w =
    words[
      Math.floor(Math.random() * words.length)
    ];

  const s =
    w.split("")
     .sort(() => 0.5 - Math.random())
     .join("");

  const [input,setInput] = useState("");

  return (

    <div className="center">

      <h3>{s}</h3>

      <input
        onChange={e => setInput(e.target.value)}
      />

      {
        input.toUpperCase() === w
        &&
        setScore(s => s + 5)
      }

    </div>
  );
}

/* ================= REACTION ================= */

function Reaction({ setScore }) {

  const [color,setColor] = useState("red");

  const start = () => {

    setColor("red");

    setTimeout(
      () => setColor("green"),
      2000
    );
  };

  return (

    <div className="center">

      <button onClick={start}>
        Start
      </button>

      <div
        className="box"
        style={{background:color}}

        onClick={() =>
          color === "green"
          &&
          setScore(s => s + 5)
        }
      />

    </div>
  );
}

/* ================= MATH ================= */

function MathGame({ setScore }) {

  const a =
    Math.floor(Math.random() * 10);

  const b =
    Math.floor(Math.random() * 10);

  const [val,setVal] = useState("");

  return (

    <div className="center">

      <h3>{a}+{b}</h3>

      <input
        onChange={e => setVal(e.target.value)}
      />

      {
        parseInt(val) === a+b
        &&
        setScore(s => s + 5)
      }

    </div>
  );
}

/* ================= CLICK ================= */

function ClickGame({ setScore }) {

  return (

    <button
      className="big-btn"
      onClick={() => setScore(s => s + 1)}
    >
      Tap Fast!
    </button>
  );
}

/* ================= ORDER ================= */

function OrderGame({ setScore }) {

  const nums =
    [1,2,3,4]
      .sort(() => Math.random()-0.5);

  const [next,setNext] = useState(1);

  return (

    <div className="mini-grid">

      {nums.map(n => (

        <div
          key={n}
          className="tile"

          onClick={() =>

            n === next
            &&
            (
              setNext(n+1),
              setScore(s => s + 5)
            )
          }
        >
          {n}
        </div>

      ))}

    </div>
  );
}