// app/(tabs)/index.tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TextInput,
  TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSae } from '@/src/context/SaeContext';
import { COLORS, ANNEES, DOMAINES } from '@/src/constants';
import { Annee, Domaine, SAe } from '@/src/types/sae.types';
import SaeCard from '@/src/components/SaeCard';


export default function HomeScreen() {
  const { saes, loading, error, filters, fetchSaes, setFilter } = useSae();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchSaes(filters);
  }, [filters]);

  // CORRECTION ICI : Ajout de (saes || []) et vérification de s.auteurs
  const filtered: SAe[] = (saes || []).filter(s => {
    const searchLower = search.toLowerCase();
    const matchesTitre = s.titre?.toLowerCase().includes(searchLower);
    const matchesAuteurs = s.auteurs?.some(a => a.toLowerCase().includes(searchLower));
    return matchesTitre || matchesAuteurs;
  });

  return (
    <View style={s.container}>
      <TextInput
        style={s.search}
        placeholder="Rechercher une SAé ou un auteur..."
        placeholderTextColor={COLORS.textMuted}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={s.filterLabel}>Année</Text>
      <View style={s.chipRow}>
        <Chip label="Toutes" active={!filters.annee} onPress={() => setFilter({ annee: null })} />
        {ANNEES.map(a => (
          <Chip
            key={a} label={a}
            active={filters.annee === a}
            onPress={() => setFilter({ annee: filters.annee === a ? null : a })}
          />
        ))}
      </View>

      <Text style={s.filterLabel}>Domaine</Text>
      <View style={s.chipRow}>
        <Chip label="Tous" active={!filters.domaine} onPress={() => setFilter({ domaine: null })} />
        {DOMAINES.map(d => (
          <Chip
            key={d} label={d}
            active={filters.domaine === d}
            onPress={() => setFilter({ domaine: filters.domaine === d ? null : d })}
          />
        ))}
      </View>

      {loading && <ActivityIndicator color={COLORS.primary} style={{ marginTop: 24 }} />}
      {!!error && <Text style={s.error}>Erreur : {error}</Text>}

      <Text style={s.count}>{filtered.length} SAé trouvée{filtered.length > 1 ? 's' : ''}</Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <SaeCard
            sae={item}
            onPress={() => router.push(`/sae/${item.id}`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ─── Chip ────────────────────────────────────────────────────────────────────
const Chip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity style={[s.chip, active && s.chipActive]} onPress={onPress}>
    <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  search: {
    backgroundColor: COLORS.surface, color: COLORS.text,
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10,
    marginBottom: 12, fontSize: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  filterLabel: {
    color: COLORS.textMuted, fontSize: 11, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textMuted, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  count: { color: COLORS.textMuted, fontSize: 12, marginBottom: 12 },
  error: { color: COLORS.danger, textAlign: 'center', marginTop: 16 },
});