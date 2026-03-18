// app/(tabs)/ranking.tsx

import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useSae } from '@/src/context/SaeContext';
import { COLORS, NOTE_COLOR } from '@/src/constants';
import { SAe } from '@/src/types/sae.types';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function RankingScreen() {
  const { saes, loading, fetchRanking } = useSae();

  useEffect(() => { fetchRanking(); }, []);

  const ranked = [...saes].sort((a, b) => b.note - a.note);

  const renderItem = ({ item, index }: { item: SAe; index: number }) => (
    <View style={s.row}>
      <Text style={s.rank}>{MEDALS[index] ?? `#${index + 1}`}</Text>
      <View style={s.info}>
        <Text style={s.titre} numberOfLines={1}>{item.titre}</Text>
        <Text style={s.meta}>{item.annee} · {item.domaine}</Text>
        <Text style={s.auteurs}>{item.auteurs.join(', ')}</Text>
      </View>
      <View style={s.noteBox}>
        <Text style={[s.note, { color: NOTE_COLOR(item.note) }]}>{item.note}</Text>
        <Text style={s.noteSub}>/20</Text>
      </View>
    </View>
  );

  return (
    <View style={s.container}>
      <Text style={s.subtitle}>Classement par note obtenue</Text>
      {loading
        ? <ActivityIndicator color={COLORS.primary} style={{ marginTop: 32 }} />
        : (
          <FlatList
            data={ranked}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 32 }}
          />
        )
      }
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  subtitle: { color: COLORS.textMuted, fontSize: 13, marginBottom: 16 },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.card, borderRadius: 12, padding: 12,
    marginBottom: 10, borderWidth: 1, borderColor: COLORS.border,
  },
  rank: { fontSize: 22, width: 40, textAlign: 'center' },
  info: { flex: 1, marginHorizontal: 12 },
  titre: { color: COLORS.text, fontWeight: '700', fontSize: 14 },
  meta: { color: COLORS.primary, fontSize: 11, marginTop: 2 },
  auteurs: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  noteBox: { alignItems: 'center' },
  note: { fontSize: 22, fontWeight: '900' },
  noteSub: { color: COLORS.textMuted, fontSize: 11 },
});
