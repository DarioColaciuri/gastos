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

const Gastos = () => {
  const [total, setTotal] = useState(0);
  const [price, setPrice] = useState("");
  const [reason, setReason] = useState("");
  const [owner, setOwner] = useState("");
  const [type, setType] = useState("income");
  const [transactions, setTransactions] = useState([]);
  const [totals, setTotals] = useState({
    darioIncome: 0,
    maluIncome: 0,
    darioExpense: 0,
    maluExpense: 0,
  });

  useEffect(() => {
    const q = query(collection(db, "gastos"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let newTransactions = [];
      let newTotal = 0;
      let darioIncome = 0;
      let maluIncome = 0;
      let darioExpense = 0;
      let maluExpense = 0;

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
      });

      setTransactions(newTransactions);
      setTotal(newTotal);
      setTotals({ darioIncome, maluIncome, darioExpense, maluExpense });
    });

    return () => unsubscribe();
  }, []);

  const handleAddTransaction = async () => {
    if (
      !price ||
      !reason ||
      !owner ||
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
        date: serverTimestamp(),
      });

      setPrice("");
      setReason("");
      setOwner("");
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

  return (
    <div>
      <h1>${total.toFixed(0)}</h1>
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
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Ingreso</option>
          <option value="expense">Egreso</option>
        </select>
        <button onClick={handleAddTransaction}>Agregar Transacción</button>
      </div>

      <table className="table">
        <thead>
          <tr className="categories">
            <th>Desc.</th>
            <th>Monto</th>
            <th>Dueño</th>
            <th>Tipo</th>
            <th>Fecha</th>
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
                ${transaction.price.toFixed(0)}
              </td>
              <td>{transaction.owner}</td>
              <td>{transaction.type === "income" ? "Ingreso" : "Egreso"}</td>
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
          <p className="ingreso">Ingresos ${totals.darioIncome.toFixed(0)}</p>
          <p className="egreso">Gastos ${totals.darioExpense.toFixed(0)}</p>
        </div>
        <div className="detalle">
          <h3>Malu</h3>
          <p className="ingreso">Ingresos ${totals.maluIncome.toFixed(0)}</p>
          <p className="egreso">Gastos ${totals.maluExpense.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
};

export default Gastos;
