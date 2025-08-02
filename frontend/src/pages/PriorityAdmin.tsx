// src/pages/PriorityAdmin.tsx
import { useEffect, useState } from "react";
import API from "../api/axios";

const PriorityAdmin = () => {
  const [priorities, setPriorities] = useState([]);
  const [form, setForm] = useState({ name: "", level: 0, color: "", description: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchPriorities = async () => {
    const res = await API.get("/priorities");
    setPriorities(res.data);
  };

  useEffect(() => {
    fetchPriorities();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");

    if (editingId) {
      await API.put(`/priorities/${editingId}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await API.post("/priorities", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    setForm({ name: "", level: 0, color: "", description: "" });
    setEditingId(null);
    fetchPriorities();
  };

  const handleEdit = (priority: any) => {
    setForm(priority);
    setEditingId(priority.id);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("access_token");
    await API.delete(`/priorities/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPriorities();
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Administrar Prioridades</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Nivel"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
        />
        <input
          placeholder="Color"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />
        <input
          placeholder="Descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">{editingId ? "Actualizar" : "Crear"}</button>
      </form>

      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Nivel</th>
            <th>Color</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {priorities.map((p: any) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.level}</td>
              <td>{p.color}</td>
              <td>{p.description}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Editar</button>
                <button onClick={() => handleDelete(p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PriorityAdmin;
