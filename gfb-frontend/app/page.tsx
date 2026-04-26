"use client";

import { useCaMensuel } from "@/hooks/useCaMensuel";
import styles from "../styles/page.module.css";
import { TableauSaisie } from "@/components/tableauSaisie";
import { ResultatsCalculs } from "@/components/resultatsCalcul";
import { CourbeTendance } from "@/components/courbeTendance";

export default function HomePage() {
  const {
    loading,
    error,
    methode1,
    methode2,
    projection,
    sauvegarderGrille,
    supprimerAnnee,
    setNbMoisProjection,
    setMethodeProjection,
  } = useCaMensuel();

  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.h1}>Budget de Vente</h1>
          <p className={styles.subtitle}>
            Coefficients saisonniers · Tendance · Projection
          </p>
        </div>
      </header>

      {error && (
        <div className={styles.errorBanner}>
          Erreur de connexion au backend : {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Chargement des données...</div>
      ) : (
        <div className={styles.grid}>
          <TableauSaisie
            onSauvegarder={sauvegarderGrille}
            onSupprimerAnnee={supprimerAnnee}
          />
          <ResultatsCalculs methode1={methode1} methode2={methode2} />
          <CourbeTendance
            projection={projection}
            onMethodeChange={setMethodeProjection}
            onNbMoisChange={setNbMoisProjection}
          />
        </div>
      )}
    </main>
  );
}
