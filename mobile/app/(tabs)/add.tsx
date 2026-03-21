// app/(tabs)/add.tsx

import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSae } from '@/src/context/SaeContext';
import { COLORS, ANNEES, SEMESTRES, DOMAINES, COMPETENCES } from '@/src/constants';
import { Annee, Competence, Domaine, SAe } from '@/src/types/sae.types';

type FormState = {
  titre: string;
  description: string;
  annee: Annee;
  semestre: number;
  domaine: Domaine;
  competences: Competence[];
  ue: string;
  auteurs: string;
  dateDebut: string;
  dateFin: string;
  note: string;
  tauxReussite: string;
  lienSite: string;
  lienProduction: string;
};

export default function AddScreen() {
  const { addSae } = useSae();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    titre: '', description: '',
    annee: 'MMI3', semestre: 5,
    domaine: 'Développement', competences: [],
    ue: '', auteurs: '',
    dateDebut: '', dateFin: '',
    note: '', tauxReussite: '',
    lienSite: '', lienProduction: '',
  });

  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const toggleComp = (c: Competence) =>
    set('competences', form.competences.includes(c)
      ? form.competences.filter(x => x !== c)
      : [...form.competences, c]);

  const handleSubmit = async () => {
    if (!form.titre.trim()) {
      Alert.alert('Champ requis', 'Le titre est obligatoire.');
      return;
    }
    
    setLoading(true);
    try {
      // Configuration du payload pour correspondre au modèle SAE.java
      const payload: Omit<SAe, 'id'> = {
        ...form,
        // Conversion de la chaîne "Alice, Bob" en tableau ["Alice", "Bob"]
        auteurs: form.auteurs.split(',').map(s => s.trim()).filter(Boolean),
        // Conversion des strings du formulaire en nombres pour MySQL
        note: parseFloat(form.note) || 0,
        tauxReussite: parseInt(form.tauxReussite) || 0,
        semestre: form.semestre as SAe['semestre'],
        images: [], // Liste vide par défaut
      };

      // Appel au backend via le Context
      await addSae(payload);
      
      Alert.alert('Succès ✓', 'SAé enregistrée dans la base de données !', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch (e: any) {
      Alert.alert('Erreur BDD', 'Impossible de contacter le serveur Spring Boot. Vérifie Docker.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

      <Label>Titre *</Label>
      <Input value={form.titre} onChange={v => set('titre', v)} placeholder="Titre de la SAé" />

      <Label>Description</Label>
      <Input value={form.description} onChange={v => set('description', v)} placeholder="Décrivez le projet..." multiline />

      <ToggleGroup
        label="Année *"
        items={ANNEES}
        selected={form.annee}
        single
        onToggle={v => set('annee', v as Annee)}
      />
      <ToggleGroup
        label="Semestre"
        items={SEMESTRES.map(String)}
        selected={String(form.semestre)}
        single
        onToggle={v => set('semestre', Number(v))}
      />
      <ToggleGroup
        label="Domaine *"
        items={DOMAINES}
        selected={form.domaine}
        single
        onToggle={v => set('domaine', v as Domaine)}
      />
      <ToggleGroup
        label="Compétences"
        items={COMPETENCES}
        selected={form.competences}
        single={false}
        onToggle={v => toggleComp(v as Competence)}
      />

      <Label>UE (ex : UE5.1)</Label>
      <Input value={form.ue} onChange={v => set('ue', v)} placeholder="UE correspondante" />

      <Label>Auteurs (séparés par des virgules)</Label>
      <Input value={form.auteurs} onChange={v => set('auteurs', v)} placeholder="Alice Martin, Bob Dupont" />

      <Label>Date de début</Label>
      <Input value={form.dateDebut} onChange={v => set('dateDebut', v)} placeholder="2025-09-01" />

      <Label>Date de fin</Label>
      <Input value={form.dateFin} onChange={v => set('dateFin', v)} placeholder="2025-12-20" />

      <Label>Note /20</Label>
      <Input value={form.note} onChange={v => set('note', v)} placeholder="15.5" keyboard="decimal-pad" />

      <Label>Taux de réussite (%)</Label>
      <Input value={form.tauxReussite} onChange={v => set('tauxReussite', v)} placeholder="85" keyboard="number-pad" />

      <Label>Lien site</Label>
      <Input value={form.lienSite} onChange={v => set('lienSite', v)} placeholder="https://..." />

      <Label>Lien production / code</Label>
      <Input value={form.lienProduction} onChange={v => set('lienProduction', v)} placeholder="https://github.com/..." />

      <TouchableOpacity
        style={[s.btn, loading && { opacity: 0.6 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={s.btnText}>Ajouter à la BDD</Text>
        }
      </TouchableOpacity>

      <View style={{ height: 48 }} />
    </ScrollView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Label = ({ children }: { children: string }) => (
  <Text style={s.label}>{children}</Text>
);

const Input = ({
  value, onChange, placeholder, multiline = false,
  keyboard = 'default',
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboard?: 'default' | 'decimal-pad' | 'number-pad';
}) => (
  <TextInput
    style={[s.input, multiline && { height: 90, textAlignVertical: 'top' }]}
    placeholder={placeholder}
    placeholderTextColor={COLORS.textMuted}
    value={value}
    onChangeText={onChange}
    keyboardType={keyboard}
    multiline={multiline}
  />
);

const ToggleGroup = ({
  label, items, selected, single, onToggle,
}: {
  label: string;
  items: readonly string[];
  selected: string | string[];
  single: boolean;
  onToggle: (v: string) => void;
}) => {
  const isActive = (item: string) =>
    Array.isArray(selected) ? selected.includes(item) : selected === item;

  return (
    <View style={{ marginBottom: 16 }}>
      <Label>{label}</Label>
      <View style={s.chipRow}>
        {items.map(item => (
          <TouchableOpacity
            key={item}
            style={[s.chip, isActive(item) && s.chipActive]}
            onPress={() => onToggle(item)}
          >
            <Text style={[s.chipText, isActive(item) && s.chipTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  label: {
    color: COLORS.textMuted, fontSize: 11, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
  },
  input: {
    backgroundColor: COLORS.surface, color: COLORS.text,
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 14, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  chipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  chipText: { color: COLORS.textMuted, fontSize: 13 },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  btn: {
    backgroundColor: COLORS.primary, padding: 16,
    borderRadius: 14, alignItems: 'center', marginTop: 8,
  },
  btnText: { color: '#fff', fontWeight: '800', fontSize: 16 },
});