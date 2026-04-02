import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import { Search } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { LinearGradient } from 'expo-linear-gradient'

interface Props { totalJobs?: number }

export function HeroBanner({ totalJobs }: Props) {
  const router = useRouter()
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.tag}>🌏 Lao động quốc tế</Text>
        <Text style={styles.heading}>Tìm việc làm{'\n'}ở nước ngoài</Text>
        <Text style={styles.sub}>
          Kết nối với {totalJobs ?? '200+'}+ việc làm tại Úc, Canada, New Zealand và nhiều quốc gia khác.
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/(tabs)/jobs')}
        activeOpacity={0.85}
        style={styles.searchBtn}
      >
        <Search size={16} color={Colors.dark} />
        <Text style={styles.searchText}>Tìm kiếm việc làm...</Text>
      </TouchableOpacity>

      <View style={styles.stats}>
        {[
          { value: '200+', label: 'Việc làm' },
          { value: '15+',  label: 'Quốc gia' },
          { value: '50+',  label: 'Ngành nghề' },
        ].map(s => (
          <View key={s.label} style={styles.statItem}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    margin: 16,
    borderRadius: 20,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textBlock:   { gap: 8 },
  tag:         { color: Colors.yellow, fontSize: 12, fontWeight: '600' },
  heading:     { color: Colors.text, fontSize: 26, fontWeight: '800', lineHeight: 34 },
  sub:         { color: Colors.muted, fontSize: 13, lineHeight: 20 },
  searchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.yellow,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchText: { color: Colors.dark, fontSize: 14, fontWeight: '600', flex: 1 },
  stats:      { flexDirection: 'row', justifyContent: 'space-around' },
  statItem:   { alignItems: 'center', gap: 2 },
  statValue:  { color: Colors.yellow, fontSize: 20, fontWeight: '800' },
  statLabel:  { color: Colors.muted, fontSize: 11 },
})
