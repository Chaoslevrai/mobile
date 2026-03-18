// app/sae/[id].tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, Image, FlatList,
  TouchableOpacity, StyleSheet, Linking, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSaeById } from '@/src/services/saeService';
import { SAe } from '@/src/types/sae.types';
import { COLORS, NOTE_COLOR, DOMAINE_COLORS } from '@/src/constants';

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [sae, setSae] = useState<SAe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSaeById(Number(id)).then(data => {
      setSae(data);
      if (data) navigation.setOptions({ title: data.titre });
      setLoading(false);
    });
  }, [id]);

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: COLORS.background }}>
      <ActivityIndicator color={COLORS.primary} size="large" />
    </View>
  );

  if (!sae) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
      <Text style={{ color: COLORS.danger }}>SAé introuvable</Text>
    </View>
  );

  const domaineColor = DOMAINE_COLORS[sae.domaine] ?? COLORS.primary;

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>
      {/* Galerie horizontale */}
      <FlatList
        data={sae.images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={s.image} resizeMode="cover" />
        )}
      />

      <View style={s.body}>
        {/* Badges */}
        <View style={s.badgeRow}>
          <View style={[s.badge, { backgroundColor: domaineColor + '22', borderColor: domaineColor }]}>
            <Text style={[s.badgeText, { color: domaineColor }]}>{sae.domaine}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: COLORS.surface, borderColor: COLORS.border }]}>
            <Text style={[s.badgeText, { color: COLORS.textMuted }]}>{sae.annee} · S{sae.semestre}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: COLORS.surface, borderColor: COLORS.border }]}>
            <Text style={[s.badgeText, { color: COLORS.textMuted }]}>{sae.ue}</Text>
          </View>
        </View>

        <Text style={s.titre}>{sae.titre}</Text>
        <Text style={s.description}>{sae.description}</Text>

        {/* Note */}
        <View style={s.noteRow}>
          <Text style={[s.note, { color: NOTE_COLOR(sae.note) }]}>{sae.note}/20</Text>
          <Text style={s.taux}>  ·  {sae.tauxReussite}% de réussite</Text>
        </View>

        {/* Dates */}
        <Section title="Dates">
          <InfoRow icon="calendar-outline" label="Début" value={new Date(sae.dateDebut).toLocaleDateString('fr-FR')} />
          <InfoRow icon="calendar" label="Fin" value={new Date(sae.dateFin).toLocaleDateString('fr-FR')} />
        </Section>

        {/* Compétences */}
        <Section title="Compétences">
          <View style={s.chipRow}>
            {sae.competences.map(c => (
              <View key={c} style={s.chip}>
                <Text style={s.chipText}>{c}</Text>
              </View>
            ))}
          </View>
        </Section>

        {/* Équipe */}
        <Section title="Équipe">
          {sae.auteurs.map(a => (
            <View key={a} style={s.auteurRow}>
              <Ionicons name="person-circle" size={20} color={COLORS.primary} />
              <Text style={s.auteur}>{a}</Text>
            </View>
          ))}
        </Section>

        {/* Liens */}
        <Section title="Liens">
          {!!sae.lienSite && (
            <TouchableOpacity style={s.link} onPress={() => Linking.openURL(sae.lienSite)}>
              <Ionicons name="globe-outline" size={16} color={COLORS.accent} />
              <Text style={s.linkText}>Site de la SAé</Text>
            </TouchableOpacity>
          )}
          {!!sae.lienProduction && (
            <TouchableOpacity style={s.link} onPress={() => Linking.openURL(sae.lienProduction)}>
              <Ionicons name="code-slash" size={16} color={COLORS.accent} />
              <Text style={s.linkText}>Code source / production</Text>
            </TouchableOpacity>
          )}
        </Section>

        {/* Bouton galerie */}
        {sae.images.length > 0 && (
          <TouchableOpacity
            style={s.galleryBtn}
            onPress={() => router.push({ pathname: '/gallery', params: { images: JSON.stringify(sae.images), titre: sae.titre } })}
          >
            <Ionicons name="images" size={18} color="#fff" />
            <Text style={s.galleryBtnText}>Voir la galerie ({sae.images.length} photos)</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={s.section}>
    <Text style={s.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ icon, label, value }: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }) => (
  <View style={s.infoRow}>
    <Ionicons name={icon} size={15} color={COLORS.primary} style={{ marginRight: 8 }} />
    <Text style={s.infoLabel}>{label} </Text>
    <Text style={s.infoValue}>{value}</Text>
  </View>
);

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  image: { width: 380, height: 220 },
  body: { padding: 16 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '600' },
  titre: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginBottom: 8 },
  description: { color: COLORS.textMuted, fontSize: 14, lineHeight: 22, marginBottom: 16 },
  noteRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 20 },
  note: { fontSize: 26, fontWeight: '900' },
  taux: { color: COLORS.textMuted, fontSize: 14 },
  section: { marginBottom: 20 },
  sectionTitle: {
    color: COLORS.text, fontSize: 13, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoLabel: { color: COLORS.textMuted, fontSize: 13 },
  infoValue: { color: COLORS.text, fontSize: 13, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.primary + '22', borderColor: COLORS.primary,
    borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  chipText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  auteurRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  auteur: { color: COLORS.text, fontSize: 14 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  linkText: { color: COLORS.accent, fontSize: 14, textDecorationLine: 'underline' },
  galleryBtn: {
    backgroundColor: COLORS.primary, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center',
    gap: 8, padding: 14, borderRadius: 12,
  },
  galleryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
