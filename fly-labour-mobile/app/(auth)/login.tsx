import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Mail, Lock } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginScreen() {
  const router = useRouter()
  const login = useAuthStore(s => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const e: typeof errors = {}
    if (!email.trim()) e.email = 'Vui lòng nhập email'
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Email không hợp lệ'
    if (!password) e.password = 'Vui lòng nhập mật khẩu'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await login(email.trim().toLowerCase(), password)
      Toast.show({ type: 'success', text1: 'Đăng nhập thành công!' })
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Đăng nhập thất bại'
      Toast.show({ type: 'error', text1: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>✈️</Text>
          </View>
          <Text style={styles.brand}>Fly Labour</Text>
          <Text style={styles.tagline}>Nền tảng lao động quốc tế</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.sub}>Chào mừng trở lại 👋</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
              leftIcon={<Mail size={16} color={Colors.muted} />}
            />
            <Input
              label="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              error={errors.password}
              leftIcon={<Lock size={16} color={Colors.muted} />}
            />
          </View>

          <Button title="Đăng nhập" onPress={handleLogin} loading={loading} fullWidth />

          <TouchableOpacity style={styles.registerRow} onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.registerText}>Chưa có tài khoản? </Text>
            <Text style={styles.registerLink}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  content: { flexGrow: 1, justifyContent: 'center', padding: 20, gap: 24 },

  logoBlock: { alignItems: 'center', gap: 8 },
  logoCircle: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: `${Colors.yellow}20`,
    borderWidth: 2, borderColor: `${Colors.yellow}40`,
    alignItems: 'center', justifyContent: 'center',
  },
  logoEmoji: { fontSize: 32 },
  brand: { color: Colors.yellow, fontSize: 26, fontWeight: '800' },
  tagline: { color: Colors.muted, fontSize: 13 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    gap: 16,
  },
  title: { color: Colors.text, fontSize: 22, fontWeight: '700' },
  sub:   { color: Colors.muted, fontSize: 14, marginTop: -8 },
  form:  { gap: 14 },

  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 4 },
  registerText: { color: Colors.muted, fontSize: 14 },
  registerLink: { color: Colors.yellow, fontSize: 14, fontWeight: '600' },
})
