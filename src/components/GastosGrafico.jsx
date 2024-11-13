import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Importa el plugin

// Registra los componentes de Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels // Registra el plugin
);

const GastosGrafico = ({ totals }) => {
  // Calcula el total de los ingresos
  const totalIngresos = totals.darioIncome + totals.maluIncome;

  // Función para calcular el porcentaje de cada categoría con respecto al total de ingresos
  const calculatePercentage = (amount) => {
    return totalIngresos > 0 ? ((amount / totalIngresos) * 100).toFixed(2) : 0;
  };

  const data = {
    labels: [
      "Ingreso Dario",
      "Ingreso Malu",
      "Egreso Dario",
      "Egreso Malu",
      "GFM",
      "GVM",
      "GFD",
      "GVD",
    ], // 8 categorías con las etiquetas correspondientes
    datasets: [
      {
        label: "Totales por categoría", // Título del gráfico
        data: [
          totals.darioIncome,
          totals.maluIncome,
          totals.darioExpense,
          totals.maluExpense,
          totals.GFM,
          totals.GVM,
          totals.GFD,
          totals.GVD,
        ], // Datos correspondientes a las 8 categorías
        backgroundColor: [
          "#4caf50",
          "#81c784",
          "#ff7043",
          "#ffab91",
          "#64b5f6",
          "#42a5f5",
          "#ffb74d",
          "#ff8a65",
        ], // Colores de las barras
        borderColor: [
          "#388e3c",
          "#66bb6a",
          "#f4511e",
          "#ff5722",
          "#1e88e5",
          "#1565c0",
          "#fb8c00",
          "#f4511e",
        ], // Colores de borde de las barras
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Gastos por categoría",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            const percentage = calculatePercentage(value);
            return `$${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        // Personaliza el comportamiento de las etiquetas de datos
        display: true,
        color: "white", // Color del texto
        font: {
          weight: "bold", // Peso de la fuente
          size: 14, // Tamaño de la fuente
        },
        formatter: function (value) {
          const percentage = calculatePercentage(value);
          return `${percentage}%`; // Muestra solo el porcentaje
        },
        anchor: "end", // Ancla la etiqueta al final de la barra
        align: "top", // Coloca la etiqueta encima de la barra
      },
    },
  };

  return (
    <div>
      <h2>Gráfico de Totales por Categoría</h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default GastosGrafico;
