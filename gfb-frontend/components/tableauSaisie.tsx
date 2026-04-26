"use client";

import { useState } from "react";
import { MOIS_LABELS } from "@/types/ca-mensuel";
import styles from "../styles/tableauSaisie.module.css";

interface Props {
  onSauvegarder: (
    items: { annee: number; mois: number; valeur: number }[],
  ) => Promise<void>;
  onSupprimerAnnee: (annee: number) => Promise<void>;
}

interface LigneEdition {
  annee: number;
  valeurs: (string | number)[];
}

export function TableauSaisie({ onSauvegarder }: Props) {
  const [lignes, setLignes] = useState<LigneEdition[]>([
    { annee: new Date().getFullYear(), valeurs: Array(12).fill("") },
  ]);
  const [saving, setSaving] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState(false);

  const ajouterAnnee = () => {
    const derniereAnnee =
      lignes[lignes.length - 1]?.annee ?? new Date().getFullYear();
    setLignes([
      ...lignes,
      { annee: derniereAnnee + 1, valeurs: Array(12).fill("") },
    ]);
  };

  const supprimerLigne = (index: number) => {
    setLignes(lignes.filter((_, i) => i !== index));
  };

  const updateAnnee = (index: number, annee: number) => {
    setLignes(lignes.map((l, i) => (i === index ? { ...l, annee } : l)));
  };

  const updateValeur = (ligneIdx: number, moisIdx: number, val: string) => {
    setLignes(
      lignes.map((l, i) => {
        if (i !== ligneIdx) return l;
        const valeurs = [...l.valeurs];
        valeurs[moisIdx] = val;
        return { ...l, valeurs };
      }),
    );
  };

  const handleSauvegarder = async () => {
    setErreur(null);
    setSucces(false);

    // Construire les items valides uniquement
    const items: { annee: number; mois: number; valeur: number }[] = [];
    for (const ligne of lignes) {
      for (let i = 0; i < 12; i++) {
        const raw = ligne.valeurs[i];
        const val = typeof raw === "string" ? parseFloat(raw) : raw;
        if (!isNaN(val) && val > 0) {
          items.push({ annee: ligne.annee, mois: i + 1, valeur: val });
        }
      }
    }

    if (items.length === 0) {
      setErreur("Aucune valeur valide à sauvegarder.");
      return;
    }

    setSaving(true);
    try {
      await onSauvegarder(items);
      setSucces(true);
      setLignes([
        { annee: new Date().getFullYear(), valeurs: Array(12).fill("") },
      ]);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Saisie des données</h2>
        <button className={styles.btnSecondary} onClick={ajouterAnnee}>
          + Ajouter une année
        </button>
      </div>

      {erreur && <div className={styles.erreur}>{erreur}</div>}
      {succes && (
        <div className={styles.succes}>Données sauvegardées avec succès.</div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thAnnee}>Année</th>
              {MOIS_LABELS.map((m) => (
                <th key={m}>{m}</th>
              ))}
              <th className={styles.thAction}></th>
            </tr>
          </thead>
          <tbody>
            {lignes.map((ligne, li) => (
              <tr key={li}>
                <td>
                  <input
                    type="number"
                    className={styles.inputAnnee}
                    value={ligne.annee}
                    onChange={(e) => updateAnnee(li, Number(e.target.value))}
                  />
                </td>
                {ligne.valeurs.map((val, mi) => (
                  <td key={mi}>
                    <input
                      type="number"
                      className={styles.inputValeur}
                      value={val}
                      min={0}
                      step={0.01}
                      placeholder="—"
                      onChange={(e) => updateValeur(li, mi, e.target.value)}
                    />
                  </td>
                ))}
                <td>
                  <button
                    className={styles.btnDelete}
                    onClick={() => supprimerLigne(li)}
                    title="Supprimer cette ligne"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footer}>
        <button
          className={styles.btnPrimary}
          onClick={handleSauvegarder}
          disabled={saving}
        >
          {saving ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </div>
    </div>
  );
}
