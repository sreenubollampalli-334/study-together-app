import { useState, useRef, useEffect } from "react";

import {
  motion,
  AnimatePresence
} from "framer-motion";

import "../styles/chatbot.css";

function ChatBot() {

  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      text:
        "👋 Hi! I'm your Study Assistant. Type 'help' to begin 🚀",

      from: "bot",

      time: getTime()
    }
  ]);

  const [input, setInput] = useState("");

  const [typing, setTyping] = useState(false);

  const chatEndRef = useRef(null);

  // AUTO SCROLL
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  // CURRENT TIME
  function getTime() {

    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  // BOT RESPONSES
  const getBotReply = (text) => {

    text = text.toLowerCase();

    if (text.includes("help")) {

      return `
📌 Commands:
• study
• planner
• connect
• timer
• motivate
• focus
• tips
      `;
    }

    if (text.includes("study")) {

      return "📚 Join study rooms and collaborate with students in real-time.";
    }

    if (text.includes("planner")) {

      return "📅 Planner helps manage tasks with realtime reminders 🔥";
    }

    if (text.includes("connect")) {

      return "🤝 Find study partners from the dashboard.";
    }

    if (text.includes("timer")) {

      return "⏱️ Pomodoro started: 25 mins focus + 5 mins break!";
    }

    if (text.includes("focus")) {

      return "🎯 Tip: Keep your phone away during deep work.";
    }

    if (text.includes("tips")) {

      return "💡 Study 50 mins + break 10 mins for best productivity.";
    }

    if (text.includes("motivate")) {

      const quotes = [

        "🔥 Stay consistent. Success follows discipline!",

        "🚀 Focus today. Shine tomorrow.",

        "🏆 Small progress every day becomes huge success.",

        "💡 Discipline beats motivation.",

        "📚 Your future self will thank you."
      ];

      return quotes[
        Math.floor(Math.random() * quotes.length)
      ];
    }

    return "🤖 I can help with study, planner, timer, motivation and focus tips!";
  };

  // SEND MESSAGE
  const sendMessage = (text) => {

    if (!text.trim()) return;

    // 🔊 SEND SOUND
    const sound =
      new Audio("/sounds/send.mp3");

    sound.play().catch(() => {});

    // USER MESSAGE
    const userMsg = {

      text,

      from: "user",

      time: getTime()
    };

    setMessages(prev => [...prev, userMsg]);

    setInput("");

    setTyping(true);

    // BOT THINKING
    setTimeout(() => {

      const botReply = getBotReply(text);

      const botMsg = {

        text: botReply,

        from: "bot",

        time: getTime()
      };

      setMessages(prev => [...prev, botMsg]);

      setTyping(false);

    }, 1200);
  };

  return (

    <>

      {/* FLOATING BUTTON */}
      <motion.div
        className="chatbot-button"

        onClick={() => setOpen(!open)}

        whileHover={{ scale: 1.12 }}

        whileTap={{ scale: 0.95 }}

        animate={{
          y: [0, -8, 0]
        }}

        transition={{
          repeat: Infinity,
          duration: 2
        }}
      >
       💬
      </motion.div>

      {/* CHAT WINDOW */}
      <AnimatePresence>

        {open && (

          <motion.div
            className="chatbot-container"

            initial={{
              opacity: 0,
              y: 50,
              scale: 0.9
            }}

            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}

            exit={{
              opacity: 0,
              y: 50,
              scale: 0.9
            }}

            transition={{
              duration: 0.25
            }}
          >

            {/* HEADER */}
            <div className="chatbot-header">

              <div>
                🤖 Study Assistant
              </div>

              <span
                onClick={() => setOpen(false)}
                className="close-btn"
              >
                ✖
              </span>

            </div>

            {/* MESSAGES */}
            <div className="chatbot-messages">

              {messages.map((msg, i) => (

                <motion.div
                  key={i}

                  initial={{
                    opacity: 0,
                    x:
                      msg.from === "user"
                        ? 50
                        : -50
                  }}

                  animate={{
                    opacity: 1,
                    x: 0
                  }}

                  className={`message-wrapper ${msg.from}`}
                >

                  {/* AVATAR */}
                  <div className="avatar">

                    {msg.from === "bot"
                      ? "🤖"
                      : "🧑"}

                  </div>

                  {/* MESSAGE */}
                  <div
                    className={`message ${msg.from}`}
                  >

                    <div>
                      {msg.text}
                    </div>

                    <small>
                      {msg.time}
                    </small>

                  </div>

                </motion.div>

              ))}

              {/* TYPING */}
              {typing && (

                <div className="typing-container">

                  <span className="typing-dot"></span>

                  <span className="typing-dot"></span>

                  <span className="typing-dot"></span>

                </div>
              )}

              <div ref={chatEndRef}></div>

            </div>

            {/* QUICK ACTIONS */}
            <div className="chatbot-suggestions">

              {[
                "Study",
                "Planner",
                "Timer",
                "Focus",
                "Motivate",
                "Help"
              ].map((item, i) => (

                <button
                  key={i}

                  onClick={() => sendMessage(item)}
                >
                  {item}
                </button>

              ))}

            </div>

            {/* INPUT */}
            <div className="chatbot-input">

              <input
                value={input}

                onChange={(e) =>
                  setInput(e.target.value)
                }

                placeholder="Ask something..."

                onKeyDown={(e) =>
                  e.key === "Enter"
                  &&
                  sendMessage(input)
                }
              />

              <motion.button
                whileTap={{ scale: 0.9 }}

                onClick={() =>
                  sendMessage(input)
                }
              >
                ➤
              </motion.button>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </>
  );
}

export default ChatBot;