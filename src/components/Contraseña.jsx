import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/contraseña.css";

const Contraseña = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_PASSWORD) {
      navigate("/gastos");
    } else {
      Toastify({
        text: "Password incorrecta",
        duration: 3000,
        newWindow: true,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
          background: "linear-gradient(to right, #b00000, #c93d3d)",
        },
      }).showToast();
    }
  };

  return (
    <div>
      <form className="contrasena" onSubmit={handleSubmit}>
        <input
          className="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Contraseña;
