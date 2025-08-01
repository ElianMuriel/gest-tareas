import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { useAuth } from "../auth/AuthContext";
import { getTasks, updateTask } from "../api/tasks";

type Task = {
  id: number;
  title: string;
  status: "pendiente" | "progreso" | "completado";
};

const Kanban = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Record<string, Task[]>>({
    pendiente: [],
    progreso: [],
    completado: [],
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (token) {
          const data = await getTasks(token);
          const grouped: Record<string, Task[]> = {
            pendiente: [],
            progreso: [],
            completado: [],
          };
          data.forEach((task: Task) => {
            grouped[task.status].push(task);
          });
          setTasks(grouped);
        }
      } catch (err) {
        console.error("Error al cargar tareas:", err);
      }
    };

    fetchTasks();
  }, [user]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    if (sourceCol === destCol && source.index === destination.index) return;

    const movedTask = tasks[sourceCol][source.index];

    const newSourceTasks = [...tasks[sourceCol]];
    newSourceTasks.splice(source.index, 1);

    const newDestTasks = [...tasks[destCol]];
    newDestTasks.splice(destination.index, 0, { ...movedTask, status: destCol as Task["status"] });

    const newState = {
      ...tasks,
      [sourceCol]: newSourceTasks,
      [destCol]: newDestTasks,
    };

    setTasks(newState);

    try {
      const token = localStorage.getItem("access_token");
      if (token) {
        await updateTask(movedTask.id, { status: destCol as Task["status"] }, token);
      }
    } catch (err) {
      console.error("Error al actualizar tarea:", err);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: "2rem" }}>
        {["pendiente", "progreso", "completado"].map((estado) => (
          <Droppable droppableId={estado} key={estado}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ flex: 1, background: "#f4f4f4", padding: 20, borderRadius: 10, minHeight: 300 }}
              >
                <h3>{estado[0].toUpperCase() + estado.slice(1)}</h3>
                {tasks[estado].map((task, index) => (
                  <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          background: "white",
                          marginBottom: 10,
                          padding: 10,
                          borderRadius: 5,
                          ...provided.draggableProps.style,
                        }}
                      >
                        {task.title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default Kanban;
