// src/types/sae.types.ts

export type Annee = 'MMI2' | 'MMI3';

export type Domaine =
  | 'Développement'
  | 'Création'
  | 'DI'
  | '3D'
  | 'Communication';

export type Competence =
  | 'Comprendre'
  | 'Concevoir'
  | 'Exprimer'
  | 'Développer'
  | 'Entreprendre';

export interface SAe {
  id: number;
  titre: string;
  description: string;
  annee: Annee;
  semestre: 3 | 4 | 5 | 6;
  domaine: Domaine;
  competences: Competence[];
  ue: string;
  images: string[];
  auteurs: string[];
  dateDebut: string; // ISO date string
  dateFin: string;
  note: number;      // /20
  tauxReussite: number; // 0-100
  lienSite: string;
  lienProduction: string;
}

export interface SaeFilters {
  annee: Annee | null;
  domaine: Domaine | null;
}

export interface SaeState {
  saes: SAe[];
  loading: boolean;
  error: string | null;
  filters: SaeFilters;
}
