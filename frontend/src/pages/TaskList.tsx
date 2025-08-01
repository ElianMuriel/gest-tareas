// src/pages/TaskList.tsx
import { useEffect, useState } from "react";
import API from "../api/axios";

type Task = {
  id: number;
  title: string;
  status: string;
  priority: { name: string };
  assignee: { username: string };
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const fetchTasks = async () => {
    try {
      const params: any = {};
      if (title) params.title = title;
      if (status) params.status = status;
      if (priority) params.priority_id = priority;
      if (assignedTo) params.assigned_to = assignedTo;

      const token = localStorage.getItem("access_token");
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Lista de Tareas</h2>

      {/* 🔍 Filtros */}
      <form onSubmit={handleFilter} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginRight: 10 }}>
          <option value="">===N/E===</option>
          <option value="pendiente">Pendiente</option>
          <option value="progreso">En Progreso</option>
          <option value="completado">Completado</option>
        </select>
        <input
          type="number"
          placeholder="ID Prioridad"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="ID Asignado a"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button type="submit">Filtrar</button>
      </form>

      {/* 📋 Tabla de tareas */}
      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Asignado a</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority?.name || "Sin prioridad"}</td>
              <td>{task.assignee?.username || "Sin asignar"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
