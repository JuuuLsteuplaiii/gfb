"use client";

import { useEffect, useRef, useState } from "react";
import type { PointProjection, MethodeCalcul } from "@/types/ca-mensuel";
import { MOIS_LABELS } from "@/types/ca-mensuel";
import styles from "../styles/courbeTendance.module.css";

interface Props {
  projection: PointProjection[];
  onMethodeChange: (m: MethodeCalcul) => void;
  onNbMoisChange: (n: number) => void;
}

export function CourbeTendance({
  projection,
  onMethodeChange,
  onNbMoisChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);
  const [methode, setMethode] = useState<MethodeCalcul>("moindres-carres");
  const [nbMois, setNbMois] = useState(12);

  useEffect(() => {
    if (typeof window === "undefined") return;
    import("chart.js/auto").then(({ default: Chart }) => {
      if (!canvasRef.current) return;
      if (chartRef.current)
        (chartRef.current as InstanceType<typeof Chart>).destroy();

      const labels = projection.map(
        (p) => `${MOIS_LABELS[p.mois - 1]} ${p.annee}`,
      );

      chartRef.current = new Chart(canvasRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Tendance (ŷ)",
              data: projection.map((p) => p.tendance),
              borderColor: "#3b82f6",
              borderDash: [5, 4],
              borderWidth: 1.5,
              pointRadius: 0,
              tension: 0,
              fill: false,
            },
            {
              label: "Ventes prévues",
              data: projection.map((p) => p.ventesPrevues),
              borderColor: "#10b981",
              backgroundColor: "rgba(16,185,129,0.07)",
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { boxWidth: 12, font: { size: 12 } },
            },
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { maxRotation: 45, font: { size: 10 } },
            },
            y: {
              grid: { color: "rgba(0,0,0,0.05)" },
              ticks: { font: { size: 11 } },
            },
          },
        },
      });
    });

    return () => {
      if (chartRef.current)
        (chartRef.current as { destroy: () => void }).destroy();
    };
  }, [projection]);

  const handleMethode = (m: MethodeCalcul) => {
    setMethode(m);
    onMethodeChange(m);
  };

  const handleNbMois = (n: number) => {
    setNbMois(n);
    onNbMoisChange(n);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Projection des ventes</h3>
        <div className={styles.controls}>
          <label className={styles.label}>
            Méthode :
            <select
              className={styles.select}
              value={methode}
              onChange={(e) => handleMethode(e.target.value as MethodeCalcul)}
            >
              <option value="moindres-carres">Moindres carrés</option>
              <option value="moyennes-mensuelles">Moy. mensuelles</option>
            </select>
          </label>
          <label className={styles.label}>
            Mois à projeter :
            <input
              type="number"
              className={styles.inputNumber}
              value={nbMois}
              min={1}
              max={36}
              onChange={(e) => handleNbMois(Number(e.target.value))}
            />
          </label>
        </div>
      </div>

      {projection.length === 0 ? (
        <div className={styles.empty}>Données insuffisantes pour projeter.</div>
      ) : (
        <>
          <div className={styles.chartWrap}>
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Courbe de tendance et ventes projetées"
            />
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Période</th>
                  <th>Mois</th>
                  <th>Tendance ŷ</th>
                  <th>Coef. sais.</th>
                  <th>Ventes prévues</th>
                </tr>
              </thead>
              <tbody>
                {projection.map((p) => (
                  <tr key={p.x}>
                    <td>{p.x}</td>
                    <td>
                      {MOIS_LABELS[p.mois - 1]} {p.annee}
                    </td>
                    <td>{p.tendance.toFixed(2)}</td>
                    <td>{p.coef.toFixed(2)}</td>
                    <td className={styles.venteCell}>
                      {p.ventesPrevues.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
