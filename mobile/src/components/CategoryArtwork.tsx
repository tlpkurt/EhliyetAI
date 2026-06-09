import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type CategoryArtworkProps = {
  categoryId: string;
  title: string;
  variant?: 'card' | 'banner';
};

const artworkMap = {
  Trafik: {
    background: '#1e81ff',
    glow: 'rgba(255,255,255,0.26)',
    accent: '#dff0ff',
    icon: 'car-sport-outline' as const,
    subtitle: 'Yol, levha ve akış',
  },
  Motor: {
    background: '#ff8a1f',
    glow: 'rgba(255,255,255,0.22)',
    accent: '#fff0df',
    icon: 'construct-outline' as const,
    subtitle: 'Bakım ve teknik kontrol',
  },
  'Ilk Yardim': {
    background: '#ff4d4f',
    glow: 'rgba(255,255,255,0.2)',
    accent: '#ffe3e3',
    icon: 'medkit-outline' as const,
    subtitle: 'Acil müdahale',
  },
  'Trafik Adabi': {
    background: '#14b85c',
    glow: 'rgba(255,255,255,0.2)',
    accent: '#def9e9',
    icon: 'leaf-outline' as const,
    subtitle: 'Saygılı sürüş',
  },
} as const;

export function CategoryArtwork({ categoryId, title, variant = 'card' }: CategoryArtworkProps) {
  const art = artworkMap[categoryId as keyof typeof artworkMap] ?? artworkMap.Trafik;

  return (
    <View style={[styles.container, variant === 'banner' ? styles.banner : styles.card, { backgroundColor: art.background }]}>
      <View style={[styles.glowOne, { backgroundColor: art.glow }]} />
      <View style={[styles.glowTwo, { backgroundColor: art.accent }]} />

      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{art.subtitle}</Text>
        </View>
        <View style={styles.pulse} />
      </View>

      <View style={styles.centerStage}>
        <View style={styles.iconWrap}>
          <Ionicons name={art.icon} size={variant === 'banner' ? 40 : 28} color="#ffffff" />
        </View>
        <View style={styles.lineGroup}>
          <View style={styles.lineShort} />
          <View style={styles.lineLong} />
          <View style={styles.lineShort} />
        </View>
      </View>

      <View style={styles.bottomRow}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <View style={styles.miniStack}>
          <View style={styles.miniCircle} />
          <View style={[styles.miniCircle, styles.miniCircleShift]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 20,
  },
  card: {
    minHeight: 128,
    padding: 14,
  },
  banner: {
    minHeight: 190,
    padding: 18,
  },
  glowOne: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -40,
    right: -40,
  },
  glowTwo: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    bottom: -30,
    left: -30,
    opacity: 0.65,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '78%',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  pulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    opacity: 0.9,
  },
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lineShort: {
    width: 16,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  lineLong: {
    width: 52,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  miniStack: {
    width: 34,
    height: 24,
    justifyContent: 'center',
  },
  miniCircle: {
    position: 'absolute',
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  miniCircleShift: {
    right: 12,
    top: 6,
  },
});
