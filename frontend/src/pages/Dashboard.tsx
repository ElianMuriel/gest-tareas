import Kanban from "./Kanban";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Gestiona tus tareas</h1>
      <Kanban />
      <Link to="/tareas">📋 Lista de Tareas</Link>
    </div>
  );
};

export default Dashboard;
