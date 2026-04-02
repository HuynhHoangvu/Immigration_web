import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

interface Props {
  label: string
  color?: string
  bg?: string
  size?: 'sm' | 'md'
}

export function Badge({ label, color = Colors.yellow, bg, size = 'md' }: Props) {
  return (
    <View style={[styles.base, size === 'sm' ? styles.sm : styles.md, { backgroundColor: bg || `${color}20`, borderColor: `${color}40` }]}>
      <Text style={[styles.text, size === 'sm' ? styles.textSm : styles.textMd, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  base:    { borderRadius: 99, borderWidth: 1, alignSelf: 'flex-start' },
  sm:      { paddingHorizontal: 8, paddingVertical: 2 },
  md:      { paddingHorizontal: 10, paddingVertical: 4 },
  text:    { fontWeight: '600' },
  textSm:  { fontSize: 10 },
  textMd:  { fontSize: 12 },
})
