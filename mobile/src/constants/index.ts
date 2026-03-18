// src/constants/index.ts

import { Annee, Competence, Domaine } from '../types/sae.types';

export const COLORS = {
  primary:    '#4F46E5',
  secondary:  '#7C3AED',
  accent:     '#06B6D4',
  background: '#0F0F1A',
  surface:    '#1A1A2E',
  card:       '#16213E',
  text:       '#F1F5F9',
  textMuted:  '#94A3B8',
  success:    '#10B981',
  warning:    '#F59E0B',
  danger:     '#EF4444',
  border:     '#2D3748',
} as const;

export const ANNEES: Annee[] = ['MMI2', 'MMI3'];

export const SEMESTRES = [3, 4, 5, 6] as const;

export const DOMAINES: Domaine[] = [
  'Développement',
  'Création',
  'DI',
  '3D',
  'Communication',
];

export const COMPETENCES: Competence[] = [
  'Comprendre',
  'Concevoir',
  'Exprimer',
  'Développer',
  'Entreprendre',
];

export const DOMAINE_COLORS: Record<Domaine, string> = {
  'Développement': '#4F46E5',
  'Création':      '#7C3AED',
  'DI':            '#F59E0B',
  '3D':            '#06B6D4',
  'Communication': '#10B981',
};

export const NOTE_COLOR = (note: number): string => {
  if (note >= 16) return '#10B981';
  if (note >= 12) return '#F59E0B';
  return '#EF4444';
};
