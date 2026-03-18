// app/gallery.tsx

import React, { useState } from 'react';
import {
  View, FlatList, Image, TouchableOpacity, Modal,
  StyleSheet, Dimensions, Text, useWindowDimensions,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/constants';

export default function GalleryScreen() {
  const { images: raw, titre } = useLocalSearchParams<{ images: string; titre: string }>();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();

  const images: string[] = raw ? JSON.parse(raw) : [];
  const ITEM = (width - 48) / 3;

  const [selected, setSelected] = useState<number | null>(null);

  React.useEffect(() => {
    if (titre) navigation.setOptions({ title: titre });
  }, [titre]);

  return (
    <View style={s.container}>
      <Text style={s.subtitle}>{images.length} photo{images.length > 1 ? 's' : ''}</Text>

      <FlatList
        data={images}
        numColumns={3}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setSelected(index)} activeOpacity={0.85}>
            <Image source={{ uri: item }} style={{ width: ITEM, height: ITEM, borderRadius: 8, margin: 2 }} />
          </TouchableOpacity>
        )}
      />

      {/* Lightbox */}
      <Modal visible={selected !== null} transparent animationType="fade" statusBarTranslucent>
        <View style={s.modal}>
          <TouchableOpacity style={s.closeBtn} onPress={() => setSelected(null)}>
            <Ionicons name="close-circle" size={32} color="#fff" />
          </TouchableOpacity>

          {selected !== null && (
            <Image source={{ uri: images[selected] }} style={s.fullImg} resizeMode="contain" />
          )}

          <View style={s.navRow}>
            <TouchableOpacity
              onPress={() => setSelected(i => (i !== null ? Math.max(0, i - 1) : 0))}
              disabled={selected === 0}
            >
              <Ionicons name="chevron-back-circle" size={40} color={selected === 0 ? '#555' : '#fff'} />
            </TouchableOpacity>

            <Text style={s.counter}>{(selected ?? 0) + 1} / {images.length}</Text>

            <TouchableOpacity
              onPress={() => setSelected(i => (i !== null ? Math.min(images.length - 1, i + 1) : 0))}
              disabled={selected === images.length - 1}
            >
              <Ionicons name="chevron-forward-circle" size={40} color={selected === images.length - 1 ? '#555' : '#fff'} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 16 },
  subtitle: { color: COLORS.textMuted, fontSize: 12, marginBottom: 12 },
  modal: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.97)',
    justifyContent: 'center', alignItems: 'center',
  },
  closeBtn: { position: 'absolute', top: 52, right: 20, zIndex: 10 },
  fullImg: { width: '100%', height: '72%' },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 32, marginTop: 20 },
  counter: { color: '#fff', fontSize: 16, minWidth: 60, textAlign: 'center' },
});
