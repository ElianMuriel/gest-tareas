// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../auth/AuthContext";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new URLSearchParams();
            formData.append("username", email);
            formData.append("password", password);

            const res = await API.post("/auth/login", formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            });

            console.log("Login exitoso", res.data); // 👈 revisa esto en la consola del navegador

            login(res.data.access_token); // 👈 asegúrate de que existe esta propiedad
            navigate("/dashboard");
        } catch (err) {
            console.error("Error real:", err);
            setError("Credenciales inválidas");
        }
    };



    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Iniciar sesión</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: 10 }}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: "100%", marginBottom: 10 }}
                />
                <button type="submit">Entrar</button>
            </form>
        </div>
    );
};

export default Login;
