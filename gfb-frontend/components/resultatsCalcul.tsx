"use client";

import { MOIS_LABELS } from "@/types/ca-mensuel";
import type { ResultatMethode1, ResultatMethode2 } from "@/types/ca-mensuel";
import styles from "../styles/resultatsCalcul.module.css";

interface Props {
  methode1: ResultatMethode1 | null;
  methode2: ResultatMethode2 | null;
}

function fmt(v: number, d = 2) {
  return v.toFixed(d);
}

export function ResultatsCalculs({ methode1, methode2 }: Props) {
  if (!methode1 || !methode2) {
    return (
      <div className={styles.empty}>
        Saisissez au moins 12 mois de données pour voir les résultats.
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Méthode 1 — Moyennes mensuelles</h3>
        <p className={styles.meta}>
          Moyenne générale : <strong>{fmt(methode1.moyenneGenerale)}</strong>
        </p>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {MOIS_LABELS.map((m) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {methode1.moyennesMensuelles.map((v, i) => (
                  <td key={i}>{fmt(v, 1)}</td>
                ))}
              </tr>
              <tr className={styles.coefRow}>
                {methode1.coefficients.map((c) => (
                  <td key={c.mois}>
                    <span
                      className={
                        c.valeur >= 1 ? styles.coefHaut : styles.coefBas
                      }
                    >
                      {fmt(c.valeur)}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={12} className={styles.tfootNote}>
                  Ligne 1 : Moyennes mensuelles &nbsp;|&nbsp; Ligne 2 :
                  Coefficients saisonniers
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>{" "}
      <section className={styles.card}>
        <h3 className={styles.cardTitle}>Méthode 2 — Moindres carrés</h3>
        <p className={styles.meta}>
          Droite de régression : <strong>{methode2.equation}</strong>
          &nbsp;&nbsp;|&nbsp;&nbsp; a = <strong>{fmt(methode2.a, 3)}</strong>
          &nbsp;&nbsp;b = <strong>{fmt(methode2.b, 2)}</strong>
        </p>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {MOIS_LABELS.map((m) => (
                  <th key={m}>{m}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className={styles.coefRow}>
                {methode2.coefficients.map((c) => (
                  <td key={c.mois}>
                    <span
                      className={
                        c.valeur >= 1 ? styles.coefHaut : styles.coefBas
                      }
                    >
                      {fmt(c.valeur)}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={12} className={styles.tfootNote}>
                  Coefficients saisonniers par rapport à la tendance générale
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
    </div>
  );
}
