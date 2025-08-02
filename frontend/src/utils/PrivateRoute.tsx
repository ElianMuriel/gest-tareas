import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("access_token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (token && user?.role !== "admin") {
      setIsUnauthorized(true);
      setTimeout(() => {
        window.location.href = "/"; // Redirige al dashboard después de mostrar el mensaje
      }, 2000); // Espera 2 segundos
    }
  }, [token, user]);

  if (!token) return <Navigate to="/login" />;

  if (isUnauthorized) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>No tienes permisos de administrador</h2>
        <p>Redirigiendo al dashboard...</p>
      </div>
    );
  }

  if (user?.role !== "admin") return null;

  return children;
};

export default PrivateRoute;
