import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export interface PollResultsChartProps {
  options: string[];
  votes: number[];
}

export function PollResultsChart({ options, votes }: PollResultsChartProps) {
  const totalVotes = votes.reduce((a, b) => a + b, 0);

  const barData = {
    labels: options,
    datasets: [
      {
        label: "Votes",
        data: votes,
        backgroundColor: "#2563eb",
      },
    ],
  };

  const pieData = {
    labels: options,
    datasets: [
      {
        data: votes,
        backgroundColor: [
          "#2563eb",
          "#10b981",
          "#f59e42",
          "#ef4444",
          "#a78bfa",
          "#f472b6",
        ],
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Bar Chart</h3>
        <Bar data={barData} options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
          scales: {
            y: { beginAtZero: true, precision: 0 },
          },
        }} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Pie Chart</h3>
        <Pie data={pieData} options={{
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
            title: { display: false },
          },
        }} />
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        Total votes: {totalVotes}
      </div>
    </div>
  );
}
