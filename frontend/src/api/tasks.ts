// src/api/tasks.ts
import API from "./axios";

export const getTasks = async (token: string) => {
    const res = await API.get("/tasks", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};

export const updateTask = async (
  taskId: number,
  updates: Partial<{ status: "pendiente" | "progreso" | "completado" }>,
  token: string
) => {
  const res = await API.patch(`/tasks/${taskId}`, updates, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
