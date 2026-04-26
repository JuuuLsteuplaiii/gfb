"use client";

import { caMensuelService } from "@/services/ca-mensuel.service";
import {
  CaMensuel,
  GrilleVentes,
  MethodeCalcul,
  PointProjection,
  ResultatMethode1,
  ResultatMethode2,
} from "@/types/ca-mensuel";
import { useState, useEffect, useCallback } from "react";
import {
  buildGrille,
  calcMethode1,
  calcMethode2,
  calcProjection,
  getAnneesSorted,
} from "../lib/calcul";

interface UseCaMensuelReturn {
  // Données brutes
  donnees: CaMensuel[];
  grille: GrilleVentes;
  annees: number[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;

  // Résultats calculés
  methode1: ResultatMethode1 | null;
  methode2: ResultatMethode2 | null;
  projection: PointProjection[];

  // Actions
  sauvegarderGrille: (
    items: { annee: number; mois: number; valeur: number }[],
  ) => Promise<void>;
  supprimerAnnee: (annee: number) => Promise<void>;
  setNbMoisProjection: (n: number) => void;
  setMethodeProjection: (m: MethodeCalcul) => void;
}

export function useCaMensuel(): UseCaMensuelReturn {
  const [donnees, setDonnees] = useState<CaMensuel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nbMoisProjection, setNbMoisProjection] = useState(12);
  const [methodeProjection, setMethodeProjection] =
    useState<MethodeCalcul>("moindres-carres");

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await caMensuelService.getAll();
      setDonnees(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const grille = buildGrille(donnees);
  const annees = getAnneesSorted(grille);

  // Calculs instantanés — se recalculent à chaque changement de `donnees`
  const methode1 = donnees.length >= 12 ? calcMethode1(donnees) : null;
  const methode2 = donnees.length >= 12 ? calcMethode2(donnees) : null;
  const projection =
    donnees.length >= 12
      ? calcProjection(donnees, methodeProjection, nbMoisProjection)
      : [];

  const sauvegarderGrille = async (
    items: { annee: number; mois: number; valeur: number }[],
  ) => {
    await caMensuelService.bulkCreate({ items });
    await fetch();
  };

  const supprimerAnnee = async (annee: number) => {
    await caMensuelService.removeByAnnee(annee);
    await fetch();
  };

  return {
    donnees,
    grille,
    annees,
    loading,
    error,
    refetch: fetch,
    methode1,
    methode2,
    projection,
    sauvegarderGrille,
    supprimerAnnee,
    setNbMoisProjection,
    setMethodeProjection,
  };
}
