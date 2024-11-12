import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Contraseña from "./components/Contraseña";
import Gastos from "./components/Gastos";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Contraseña />} />
          <Route path="/gastos" element={<Gastos />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
