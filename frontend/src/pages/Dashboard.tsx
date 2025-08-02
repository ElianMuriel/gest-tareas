// src/pages/Dashboard.tsx
import Kanban from "./Kanban";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Gestiona tus tareas</h1>
      <Kanban />
      <Link to="/tareas">📋 Lista de Tareas</Link>

      {user?.role === "admin" && (
        <div style={{ marginTop: "10px" }}>
          <Link to="/prioridades">🎯 Administrar Prioridades</Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
