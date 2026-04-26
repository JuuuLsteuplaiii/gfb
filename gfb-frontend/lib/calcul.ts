import type {
  CaMensuel,
  GrilleVentes,
  ResultatMethode1,
  ResultatMethode2,
  CoefSaisonnier,
  PointProjection,
  MethodeCalcul,
} from "@/types/ca-mensuel";

export function buildGrille(donnees: CaMensuel[]): GrilleVentes {
  const grille: GrilleVentes = {};
  for (const d of donnees) {
    if (!grille[d.annee]) grille[d.annee] = {};
    grille[d.annee][d.mois] = Number(d.valeur);
  }
  return grille;
}

export function getAnneesSorted(grille: GrilleVentes): number[] {
  return Object.keys(grille)
    .map(Number)
    .sort((a, b) => a - b);
}

// Méthode de La Moyenne Mensuelle : calculer la moyenne de chaque mois sur toutes les années, puis les coefficients saisonniers = moyenne du mois / moyenne générale
export function calcMethode1(donnees: CaMensuel[]): ResultatMethode1 {
  const grille = buildGrille(donnees);
  const annees = getAnneesSorted(grille);

  // Moyenne par mois (sur toutes les années)
  const moyennesMensuelles: number[] = [];
  for (let mois = 1; mois <= 12; mois++) {
    const vals = annees
      .map((a) => grille[a]?.[mois])
      .filter((v): v is number => v != null);
    moyennesMensuelles.push(
      vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0,
    );
  }

  const moyenneGenerale = moyennesMensuelles.reduce((s, v) => s + v, 0) / 12;

  const coefficients: CoefSaisonnier[] = moyennesMensuelles.map((m, i) => ({
    mois: i + 1,
    valeur: moyenneGenerale > 0 ? m / moyenneGenerale : 0,
  }));

  return { moyenneGenerale, moyennesMensuelles, coefficients };
}

// Méthode de Moindres carrés
export function calcMethode2(donnees: CaMensuel[]): ResultatMethode2 {
  const grille = buildGrille(donnees);
  const annees = getAnneesSorted(grille);

  // Construire la série chronologique (x = rang 1..N*12)
  type Point = { x: number; y: number; annee: number; mois: number };
  const serie: Point[] = [];
  let x = 1;
  for (const annee of annees) {
    for (let mois = 1; mois <= 12; mois++) {
      const y = grille[annee]?.[mois];
      if (y != null) serie.push({ x: x++, y, annee, mois });
    }
  }

  const N = serie.length;
  const sumX = serie.reduce((s, p) => s + p.x, 0);
  const sumY = serie.reduce((s, p) => s + p.y, 0);
  const sumX2 = serie.reduce((s, p) => s + p.x ** 2, 0);
  const sumXY = serie.reduce((s, p) => s + p.x * p.y, 0);
  const xBar = sumX / N;
  const yBar = sumY / N;

  const a = (sumXY - N * xBar * yBar) / (sumX2 - N * xBar ** 2);
  const b = yBar - a * xBar;

  // Valeurs estimées
  const estimations: GrilleVentes = {};
  const rapports: GrilleVentes = {};

  for (const p of serie) {
    const estim = a * p.x + b;
    if (!estimations[p.annee]) estimations[p.annee] = {};
    if (!rapports[p.annee]) rapports[p.annee] = {};
    estimations[p.annee][p.mois] = +estim.toFixed(4);
    rapports[p.annee][p.mois] = estim > 0 ? +(p.y / estim).toFixed(4) : 0;
  }

  // Coefficients saisonniers = moyenne des rapports par mois
  const coefficients: CoefSaisonnier[] = [];
  for (let mois = 1; mois <= 12; mois++) {
    const vals = annees
      .map((a) => rapports[a]?.[mois])
      .filter((v): v is number => v != null);
    coefficients.push({
      mois,
      valeur:
        vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0,
    });
  }

  return {
    a,
    b,
    equation: `y = ${a.toFixed(3)}x + ${b.toFixed(2)}`,
    estimations,
    rapports,
    coefficients,
  };
}

// Calcul pour les projections
export function calcProjection(
  donnees: CaMensuel[],
  methode: MethodeCalcul,
  nbMois: number,
): PointProjection[] {
  const grille = buildGrille(donnees);
  const annees = getAnneesSorted(grille);

  // Rang du dernier point connu
  let lastX = 0;
  for (const annee of annees) {
    for (let mois = 1; mois <= 12; mois++) {
      if (grille[annee]?.[mois] != null) lastX++;
    }
  }

  // Droite de régression (toujours issue des moindres carrés)
  const { a, b, coefficients: coefMC } = calcMethode2(donnees);
  const coefM1 = calcMethode1(donnees).coefficients;
  const coefs = methode === "moindres-carres" ? coefMC : coefM1;

  // Dernière année/mois connu
  const derniereAnnee = annees[annees.length - 1];
  const dernierMois = Math.max(
    ...Object.keys(grille[derniereAnnee] ?? {}).map(Number),
  );

  const points: PointProjection[] = [];
  let annee = derniereAnnee;
  let mois = dernierMois;

  for (let i = 1; i <= nbMois; i++) {
    mois++;
    if (mois > 12) {
      mois = 1;
      annee++;
    }

    const x = lastX + i;
    const tendance = a * x + b;
    const coef =
      coefs.find((c: CoefSaisonnier) => c.mois === mois)?.valeur ?? 1;

    points.push({
      x,
      annee,
      mois,
      tendance: +tendance.toFixed(2),
      coef: +coef.toFixed(4),
      ventesPrevues: +(tendance * coef).toFixed(2),
    });
  }

  return points;
}
