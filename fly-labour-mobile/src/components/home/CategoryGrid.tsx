import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { Colors } from '@/constants/colors'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  selected?: string
  onSelect: (id: string | undefined) => void
}

export function CategoryGrid({ categories, selected, onSelect }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <TouchableOpacity
        onPress={() => onSelect(undefined)}
        style={[styles.chip, !selected && styles.chipActive]}
      >
        <Text style={styles.chipIcon}>🌐</Text>
        <Text style={[styles.chipText, !selected && styles.chipTextActive]}>Tất cả</Text>
      </TouchableOpacity>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat.id}
          onPress={() => onSelect(cat.id)}
          style={[styles.chip, selected === cat.id && styles.chipActive]}
        >
          <Text style={styles.chipIcon}>{cat.icon}</Text>
          <Text style={[styles.chipText, selected === cat.id && styles.chipTextActive]}>
            {cat.name}
          </Text>
          {cat._count && cat._count.jobs > 0 && (
            <View style={styles.count}>
              <Text style={styles.countText}>{cat._count.jobs}</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  chipActive: { borderColor: Colors.yellow, backgroundColor: `${Colors.yellow}15` },
  chipIcon:   { fontSize: 14 },
  chipText:   { color: Colors.muted, fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: Colors.yellow },
  count: {
    backgroundColor: Colors.surface,
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  countText: { color: Colors.muted, fontSize: 10 },
})
