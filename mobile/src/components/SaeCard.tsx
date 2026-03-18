// src/components/SaeCard.tsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SAe } from '../types/sae.types';
import { COLORS, DOMAINE_COLORS, NOTE_COLOR } from '../constants';

interface Props {
  sae: SAe;
  onPress: () => void;
}

export default function SaeCard({ sae, onPress }: Props) {
  const domaineColor = DOMAINE_COLORS[sae.domaine] ?? COLORS.primary;
  const noteColor = NOTE_COLOR(sae.note);

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.85}>
      {sae.images?.[0] && (
        <Image source={{ uri: sae.images[0] }} style={s.cover} resizeMode="cover" />
      )}
      <View style={s.body}>
        <View style={s.badgeRow}>
          <View style={[s.badge, { backgroundColor: domaineColor + '22', borderColor: domaineColor }]}>
            <Text style={[s.badgeText, { color: domaineColor }]}>{sae.domaine}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: COLORS.surface, borderColor: COLORS.border }]}>
            <Text style={[s.badgeText, { color: COLORS.textMuted }]}>{sae.annee} · S{sae.semestre}</Text>
          </View>
        </View>
        <Text style={s.titre} numberOfLines={2}>{sae.titre}</Text>
        <Text style={s.auteurs} numberOfLines={1}>{sae.auteurs.join(' · ')}</Text>
        <View style={s.footer}>
          <Text style={[s.note, { color: noteColor }]}>{sae.note}/20</Text>
          <Text style={s.taux}>{sae.tauxReussite}% réussite</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card, borderRadius: 16,
    marginBottom: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: COLORS.border,
  },
  cover: { width: '100%', height: 160 },
  body: { padding: 14 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  titre: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  auteurs: { color: COLORS.textMuted, fontSize: 12, marginBottom: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  note: { fontSize: 15, fontWeight: '800' },
  taux: { color: COLORS.textMuted, fontSize: 12 },
});
