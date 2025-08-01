// src/pages/TaskList.tsx
import { useEffect, useState } from "react";
import API from "../api/axios";
import TaskFormModal from "../components/TaskFormModal";

type Task = {
  id: number;
  title: string;
  status: string;
  priority?: { id: number; name: string };
  assignee?: { id: number; username: string };
  description?: string;
  due_date?: string;
  estimated_hours?: number;
  completion_percentage?: number;
  assigned_to?: number;
  priority_id?: number;
};

type User = {
  id: number;
  username: string;
};

type Priority = {
  id: number;
  name: string;
};

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const token = localStorage.getItem("access_token");

  const fetchTasks = async () => {
    try {
      const params: any = {};
      if (title) params.title = title;
      if (status) params.status = status;
      if (priority) params.priority_id = priority;
      if (assignedTo) params.assigned_to = assignedTo;

      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  const fetchUsersAndPriorities = async () => {
    try {
        const [userRes, priorityRes] = await Promise.all([
        API.get("/users", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/priorities", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        console.log("Usuarios cargados:", userRes.data); // ✅ Agrega esto
        console.log("Prioridades cargadas:", priorityRes.data); // ✅ Y esto también
        setUsers(userRes.data);
        setPriorities(priorityRes.data);
    } catch (err) {
        console.error("Error cargando usuarios o prioridades:", err);
    }
    };
  useEffect(() => {
    fetchTasks();
    fetchUsersAndPriorities();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleOpenCreate = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSave = async (form: any) => {
    try {
      if (selectedTask) {
        await API.patch(`/tasks/${selectedTask.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await API.post("/tasks", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err) {
      console.error("Error al guardar tarea:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Lista de Tareas</h2>

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
        <button type="button" onClick={handleOpenCreate} style={{ marginLeft: 10 }}>
          Nueva Tarea
        </button>
      </form>

      <table width="100%" border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Asignado a</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority?.name || "Sin prioridad"}</td>
              <td>{task.assignee?.username || "Sin asignar"}</td>
              <td>
                <button onClick={() => handleOpenEdit(task)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <TaskFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selectedTask}
        users={users}
        priorities={priorities}
      />
    </div>
  );
};

export default TaskList;
