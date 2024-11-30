import React, { useState, useEffect } from "react";
import { db } from "../firebase/config.js";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import "../css/gastos.css";
import GastosGrafico from "./GastosGrafico.jsx";

const Gastos = () => {
  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState("");
  const [reason, setReason] = useState("");
  const [owner, setOwner] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState(""); // Nuevo estado para la categoría
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({
    darioIncome: 0,
    maluIncome: 0,
    darioExpense: 0,
    maluExpense: 0,
    GFM: 0,
    GVM: 0,
    GFD: 0,
    GVD: 0,
    GPM: 0,
    GPD: 0,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const q = query(collection(db, "gastos"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newTransactions = [];
      let newTotal = 0;
      let darioIncome = 0;
      let maluIncome = 0;
      let darioExpense = 0;
      let maluExpense = 0;
      let GFM = 0,
        GVM = 0,
        GFD = 0,
        GVD = 0,
        GPM = 0,
        GPD = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        newTransactions.push({ id: doc.id, ...data });

        if (data.type === "income") {
          newTotal += data.price;
          data.owner === "dario"
            ? (darioIncome += data.price)
            : (maluIncome += data.price);
        } else {
          newTotal -= data.price;
          data.owner === "dario"
            ? (darioExpense += data.price)
            : (maluExpense += data.price);
        }

        switch (data.category) {
          case "GFM":
            GFM += data.price;
            break;
          case "GVM":
            GVM += data.price;
            break;
          case "GFD":
            GFD += data.price;
            break;
          case "GVD":
            GVD += data.price;
            break;
          case "GPM":
            GPM += data.price;
            break;
          case "GPD":
            GPD += data.price;
            break;
          default:
            break;
        }
      });

      setTransactions(newTransactions);
      setTotal(newTotal);
      setTotals({
        darioIncome,
        maluIncome,
        darioExpense,
        maluExpense,
        GFM,
        GVM,
        GFD,
        GVD,
        GPM,
        GPD,
      });
    });

    return () => unsubscribe();
  }, []);

  const handleAddTransaction = async () => {
    if (
      !price ||
      !reason ||
      !owner ||
      !category ||
      (owner !== "dario" && owner !== "malu")
    ) {
      Toastify({
        text: "Por favor, completa todos los campos correctamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #b00000, #c93d3d)",
        },
      }).showToast();
      return;
    }

    try {
      await addDoc(collection(db, "gastos"), {
        price: parseFloat(price),
        reason,
        owner,
        type,
        category,
        date: serverTimestamp(),
      });

      setPrice("");
      setReason("");
      setOwner("");
      setCategory("");
      setType("income");

      Toastify({
        text: "Transacción añadida correctamente",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #4caf50, #81c784)",
        },
      }).showToast();
    } catch (error) {
      Toastify({
        text: "Error al añadir transacción",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "linear-gradient(to right, #b00000, #c93d3d)",
        },
      }).showToast();
    }
  };

  const handleDeleteTransaction = async (id) => {
    const confirmation = await Swal.fire({
      title: "¿Querés eliminar esta transacción?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmation.isConfirmed) {
      try {
        await deleteDoc(doc(db, "gastos", id));

        Toastify({
          text: "Transacción eliminada correctamente",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #b00000, #c93d3d)",
          },
        }).showToast();
      } catch (error) {
        Toastify({
          text: "Error al eliminar transacción",
          duration: 3000,
          gravity: "top",
          position: "right",
          style: {
            background: "linear-gradient(to right, #b00000, #c93d3d)",
          },
        }).showToast();
      }
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sortedTransactions = [...transactions].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setTransactions(sortedTransactions);
  };

  return (
    <div>
      <h1 className="total">${total.toLocaleString()}</h1>
      <div className="dividido">
        <h2 className="dario">
          Dario: ${(totals.darioIncome - totals.darioExpense).toLocaleString()}
        </h2>
        <h2 className="malu">
          Malu: ${(totals.maluIncome - totals.maluExpense).toLocaleString()}
        </h2>
      </div>
      <div className="add-transaction">
        <input
          type="number"
          placeholder="Monto"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <select value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="">Seleccionar propietario</option>
          <option value="dario">Dario</option>
          <option value="malu">Malu</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Seleccionar razón</option>
          <option value="+">+</option>
          <option value="GFM">GFM</option>
          <option value="GVM">GVM</option>
          <option value="GFD">GFD</option>
          <option value="GVD">GVD</option>
          <option value="GPM">GPM</option>
          <option value="GPD">GPD</option>
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Ingreso</option>
          <option value="expense">Egreso</option>
        </select>
        <button onClick={handleAddTransaction}>Agregar Transacción</button>
      </div>

      <table className="table">
        <thead>
          <tr className="categories">
            <th onClick={() => handleSort("reason")}>Desc.</th>
            <th onClick={() => handleSort("price")}>Monto</th>
            <th onClick={() => handleSort("owner")}>Dueño</th>
            <th onClick={() => handleSort("type")}>Tipo</th>
            <th onClick={() => handleSort("category")}>Razón</th>
            <th onClick={() => handleSort("date")}>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.reason}</td>
              <td
                className={transaction.type === "income" ? "ingreso" : "egreso"}
              >
                ${transaction.price.toLocaleString()}
              </td>
              <td>{transaction.owner}</td>
              <td>{transaction.type === "income" ? "Ingreso" : "Egreso"}</td>
              <td>{transaction.category}</td>
              <td>
                {transaction.date
                  ? new Date(transaction.date.seconds * 1000).toLocaleString()
                  : "Pendiente"}
              </td>
              <td>
                <button onClick={() => handleDeleteTransaction(transaction.id)}>
                  Borrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-individual">
        <h2>Totales por tipo y propietario:</h2>
        <div className="detalle">
          <h3>Dario</h3>
          <p className="ingreso">
            Ingresos ${totals.darioIncome.toLocaleString()}
          </p>
          <p className="egreso">
            Gastos ${totals.darioExpense.toLocaleString()}
          </p>
          <p className="egreso">Fijos ${totals.GFD.toLocaleString()}</p>
          <p className="egreso">Variables ${totals.GVD.toLocaleString()}</p>
          <p className="egreso">Personales ${totals.GPD.toLocaleString()}</p>
        </div>
        <div className="detalle">
          <h3>Malu</h3>
          <p className="ingreso">
            Ingresos ${totals.maluIncome.toLocaleString()}
          </p>
          <p className="egreso">
            Gastos ${totals.maluExpense.toLocaleString()}
          </p>
          <p className="egreso">Fijos ${totals.GFM.toLocaleString()}</p>
          <p className="egreso">Variables ${totals.GVM.toLocaleString()}</p>
          <p className="egreso">Personales ${totals.GPM.toLocaleString()}</p>
        </div>
      </div>
      <GastosGrafico totals={totals} />
    </div>
  );
};

export default Gastos;
