export interface CaMensuel {
  id: number;
  annee: number;
  mois: number; // 1–12
  valeur: number;
  created_at: string;
}

// DTOs pour les requêtes à l'API
export interface CreateCaMensuelDto {
  annee: number;
  mois: number;
  valeur: number;
}

export interface UpdateCaMensuelDto {
  annee?: number;
  mois?: number;
  valeur?: number;
}

export interface BulkCreateCaMensuelDto {
  items: CreateCaMensuelDto[];
}

export interface FilterCaMensuelDto {
  annee?: number;
  mois?: number;
}

// Tableau [annee][mois] → valeur | null  (pour la grille de saisie)
export type GrilleVentes = Record<number, Record<number, number | null>>;

// Résultat d'un calcul de coefficient saisonnier
export interface CoefSaisonnier {
  mois: number; // 1–12
  valeur: number; // ex: 1.09
}

// Résultat complet de la Méthode de Moyennes mensuelles
export interface ResultatMethode1 {
  moyenneGenerale: number;
  moyennesMensuelles: number[];
  coefficients: CoefSaisonnier[];
}

// Résultat complet de la Méthode de Moindres carrés
export interface ResultatMethode2 {
  a: number; // pente
  b: number; // constante
  equation: string; // "y = ax + b"
  estimations: GrilleVentes;
  rapports: GrilleVentes;
  coefficients: CoefSaisonnier[];
}

// Un point de projection
export interface PointProjection {
  x: number; // rang chronologique
  annee: number;
  mois: number;
  tendance: number;
  coef: number;
  ventesPrevues: number;
}

export type MethodeCalcul = "moyennes-mensuelles" | "moindres-carres";

export const MOIS_LABELS = [
  "Janv",
  "Févr",
  "Mars",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sept",
  "Oct",
  "Nov",
  "Déc",
];
