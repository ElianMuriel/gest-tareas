import { useState, useEffect } from "react";

const TaskFormModal = ({ open, onClose, onSave, initialData, users, priorities }: any) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority_id: "",
    status: "pendiente",
    due_date: "",
    estimated_hours: "",
    completion_percentage: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    } else {
      setForm({
        title: "",
        description: "",
        assigned_to: "",
        priority_id: "",
        status: "pendiente",
        due_date: "",
        estimated_hours: "",
        completion_percentage: "",
      });
    }
  }, [initialData]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSave(form);
  };

  if (!open) return null;

  return (
    <div style={{ background: "#0009", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <form onSubmit={handleSubmit} style={{ background: "#fff", padding: 20, margin: "5% auto", maxWidth: 500 }}>
        <h3>{initialData ? "Editar tarea" : "Crear tarea"}</h3>
        <input name="title" placeholder="Título" value={form.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} />
        <select name="assigned_to" value={form.assigned_to} onChange={handleChange}>
          <option value="">No asignado</option>
          {users.map((u: any) => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
        <select name="priority_id" value={form.priority_id} onChange={handleChange}>
          <option value="">Sin prioridad</option>
          {priorities.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pendiente">Pendiente</option>
          <option value="progreso">En Progreso</option>
          <option value="completado">Completado</option>
        </select>
        <input name="due_date" type="date" value={form.due_date?.split("T")[0]} onChange={handleChange} />
        <input name="estimated_hours" type="number" placeholder="Horas estimadas" value={form.estimated_hours} onChange={handleChange} />
        <input name="completion_percentage" type="number" placeholder="% completado" value={form.completion_percentage} onChange={handleChange} />
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default TaskFormModal;
