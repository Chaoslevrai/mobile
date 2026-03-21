// src/services/saeService.ts

import axios from 'axios';
import { SAe, SaeFilters } from '../types/sae.types';
import { MOCK_SAES } from './mockData';

// ─── Config ──────────────────────────────────────────────────────────────────
const USE_MOCK = false; // ← false quand le back Spring Boot est prêt

const BASE_URL = 'http://192.168.0.19:8080/api'; // Android emulator
// const BASE_URL = 'http://localhost:8080/api'; // iOS simulator

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ─── Fonctions ────────────────────────────────────────────────────────────────

export const getAllSaes = async (filters: Partial<SaeFilters> = {}): Promise<SAe[]> => {
  if (USE_MOCK) {
    await delay();
    let result = [...MOCK_SAES];
    if (filters.annee)   result = result.filter(s => s.annee === filters.annee);
    if (filters.domaine) result = result.filter(s => s.domaine === filters.domaine);
    return result;
  }
  const hasFilters = filters.annee || filters.domaine;
  const endpoint = hasFilters ? '/saes/filter' : '/saes';
  const { data } = await api.get<SAe[]>('/saes', { params: filters });
  return data;
};

export const getSaeById = async (id: number): Promise<SAe | null> => {
  if (USE_MOCK) {
    await delay();
    return MOCK_SAES.find(s => s.id === id) ?? null;
  }
const { data } = await api.get<SAe>(`/saes/${id}`);
  return data;
};

export const getSaesByNote = async (): Promise<SAe[]> => {
  if (USE_MOCK) {
    await delay();
    return [...MOCK_SAES].sort((a, b) => b.note - a.note);
  }
  const { data } = await api.get<SAe[]>('/saes', { params: { sort: 'note,desc' } });
  return data;
};

export const createSae = async (saeData: Omit<SAe, 'id'>): Promise<SAe> => {
  if (USE_MOCK) {
    await delay(500);
    const newSae: SAe = { ...saeData, id: Date.now() };
    MOCK_SAES.push(newSae);
    return newSae;
  }
  const { data } = await api.post<SAe>('/saes', saeData);
  return data;
};

export const getAllImages = async (): Promise<{ url: string; saeId: number; saeTitre: string }[]> => {
  if (USE_MOCK) {
    await delay();
    return MOCK_SAES.flatMap(s =>
      s.images.map(url => ({ url, saeId: s.id, saeTitre: s.titre }))
    );
  }
  const { data } = await api.get('/saes/images');
  return data;
};
