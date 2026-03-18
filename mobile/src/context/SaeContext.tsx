// src/context/SaeContext.tsx

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { SAe, SaeFilters, SaeState } from '../types/sae.types';
import { getAllSaes, getSaesByNote, createSae } from '../services/saeService';

// ─── Actions ─────────────────────────────────────────────────────────────────
type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: SAe[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_FILTER'; payload: Partial<SaeFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_SAE'; payload: SAe };

const initialState: SaeState = {
  saes: [],
  loading: false,
  error: null,
  filters: { annee: null, domaine: null },
};

const saeReducer = (state: SaeState, action: Action): SaeState => {
  switch (action.type) {
    case 'FETCH_START':   return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS': return { ...state, loading: false, saes: action.payload };
    case 'FETCH_ERROR':   return { ...state, loading: false, error: action.payload };
    case 'SET_FILTER':    return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS': return { ...state, filters: { annee: null, domaine: null } };
    case 'ADD_SAE':       return { ...state, saes: [action.payload, ...state.saes] };
    default:              return state;
  }
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface SaeContextValue extends SaeState {
  fetchSaes: (filters?: Partial<SaeFilters>) => Promise<void>;
  fetchRanking: () => Promise<void>;
  addSae: (data: Omit<SAe, 'id'>) => Promise<SAe>;
  setFilter: (filter: Partial<SaeFilters>) => void;
  resetFilters: () => void;
}

const SaeContext = createContext<SaeContextValue | null>(null);

export const SaeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(saeReducer, initialState);

  const fetchSaes = useCallback(async (filters: Partial<SaeFilters> = {}) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await getAllSaes(filters);
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err: any) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, []);

  const fetchRanking = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await getSaesByNote();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (err: any) {
      dispatch({ type: 'FETCH_ERROR', payload: err.message });
    }
  }, []);

  const addSae = useCallback(async (saeData: Omit<SAe, 'id'>) => {
    const newSae = await createSae(saeData);
    dispatch({ type: 'ADD_SAE', payload: newSae });
    return newSae;
  }, []);

  const setFilter = useCallback((filter: Partial<SaeFilters>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  return (
    <SaeContext.Provider value={{ ...state, fetchSaes, fetchRanking, addSae, setFilter, resetFilters }}>
      {children}
    </SaeContext.Provider>
  );
};

export const useSae = (): SaeContextValue => {
  const ctx = useContext(SaeContext);
  if (!ctx) throw new Error('useSae must be used inside SaeProvider');
  return ctx;
};
