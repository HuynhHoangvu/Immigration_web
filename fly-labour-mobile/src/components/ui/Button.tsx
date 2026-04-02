import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

interface Props {
  title: string
  onPress: () => void
  variant?: 'primary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, fullWidth }: Props) {
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? Colors.dark : Colors.yellow} />
      ) : (
        <Text style={[styles.text, styles[`text_${variant}` as keyof typeof styles]]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },

  // Variants
  primary: { backgroundColor: Colors.yellow, borderColor: Colors.yellow },
  outline: { backgroundColor: 'transparent', borderColor: Colors.yellow },
  ghost:   { backgroundColor: 'transparent', borderColor: 'transparent' },
  danger:  { backgroundColor: '#f8514920', borderColor: Colors.red },

  // Sizes
  sm: { paddingHorizontal: 14, paddingVertical: 8 },
  md: { paddingHorizontal: 20, paddingVertical: 12 },
  lg: { paddingHorizontal: 24, paddingVertical: 16 },

  // Text
  text: { fontWeight: '600', fontSize: 15 },
  text_primary: { color: Colors.dark },
  text_outline:  { color: Colors.yellow },
  text_ghost:    { color: Colors.muted },
  text_danger:   { color: Colors.red },
})
