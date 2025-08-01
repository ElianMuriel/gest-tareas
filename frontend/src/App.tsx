// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./auth/AuthContext";
import Kanban from "./pages/Kanban";

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <p>🔒 No autorizado</p>}
        />
        <Route
          path="/kanban"
          element={user ? <Kanban /> : <p>🔒 No autorizado</p>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
