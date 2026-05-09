import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Planner from "./components/Planner";
import Rooms from "./components/Rooms";
import Messages from "./components/Messages";
import GamesSection from "./components/GameSection";
import Home from "./components/Home";
import Conversation from "./components/Conversation";
import ConnectionPage from "./components/ConnectionPage";
import Partners from "./components/Partners";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Achievements from "./components/Achievements";
import NotificationListener from "./components/NotificationListener";
import LearnSkills from "./components/LearnSkills";

// ✅ Token validation
function isValidToken(token) {
  return token && token.length > 20;
}

// 🚫 Prevent logged-in users from seeing login/register
function PublicRoute({ children }) {

  const token = localStorage.getItem("token");

  return isValidToken(token)
    ? <Navigate to="/dashboard" />
    : children;
}

function App() {

  const token = localStorage.getItem("token");

  return (

    <BrowserRouter>

      <Routes>

        {/* ✅ ROOT */}
        <Route
          path="/"
          element={
            isValidToken(token)
              ? <Navigate to="/dashboard" />
              : <Navigate to="/register" />
          }
        />

        {/* ✅ REGISTER */}
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        {/* ✅ LOGIN */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 🔐 PROTECTED ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>

              <>
                {/* 🔔 REALTIME NOTIFICATIONS */}
                <NotificationListener />

                {/* 📦 MAIN LAYOUT */}
                <MainLayout />
              </>

            </ProtectedRoute>
          }
        >

          {/* DASHBOARD */}
          <Route
            path="dashboard"
            element={<Home />}
          />
<Route
  path="/learn-skills"
  element={<LearnSkills />}
/>
          {/* CHAT */}
          <Route
            path="chat/:email"
            element={<Conversation />}
          />

          {/* STUDY */}
          <Route
            path="study"
            element={<ConnectionPage />}
          />

          {/* ROOMS */}
          <Route
            path="rooms"
            element={<Rooms />}
          />

          {/* PLANNER */}
          <Route
            path="planner"
            element={<Planner />}
          />

          {/* MESSAGES */}
          <Route
            path="messages"
            element={<Messages />}
          />

          {/* GAMES */}
          <Route
            path="games"
            element={<GamesSection />}
          />

          {/* PARTNERS */}
          <Route
            path="partners"
            element={<Partners />}
          />

          {/* FEEDBACK */}
          <Route
            path="feedback"
            element={<Profile />}
          />

          {/* ACHIEVEMENTS */}
          <Route
            path="achievements"
            element={<Achievements />}
          />

        </Route>

        {/* ✅ FALLBACK */}
        <Route
          path="*"
          element={
            isValidToken(token)
              ? <Navigate to="/dashboard" />
              : <Navigate to="/register" />
          }
        />

      </Routes>
      <ToastContainer />

    </BrowserRouter>
  );
}

export default App;