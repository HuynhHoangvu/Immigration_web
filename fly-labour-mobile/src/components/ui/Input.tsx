import { View, Text, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react-native'
import { Colors } from '@/constants/colors'

interface Props extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
}

export function Input({ label, error, leftIcon, secureTextEntry, style, ...props }: Props) {
  const [showPw, setShowPw] = useState(false)
  const isPassword = secureTextEntry

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputRow, error ? styles.inputError : styles.inputNormal]}>
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithIcon : undefined, style]}
          placeholderTextColor={Colors.muted}
          selectionColor={Colors.yellow}
          secureTextEntry={isPassword && !showPw}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
            {showPw
              ? <EyeOff size={18} color={Colors.muted} />
              : <Eye size={18} color={Colors.muted} />
            }
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 13, color: Colors.muted, fontWeight: '500' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
  },
  inputNormal: { borderColor: Colors.border },
  inputError:  { borderColor: Colors.red },
  leftIcon:    { paddingLeft: 14 },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  inputWithIcon: { paddingLeft: 8 },
  eyeBtn: { paddingRight: 14 },
  error: { fontSize: 12, color: Colors.red },
})
