import { useState } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { User, Mail, Lock, Phone, Building2 } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

type Role = 'user' | 'employer'

export default function RegisterScreen() {
  const router = useRouter()
  const register = useAuthStore(s => s.register)
  const [role, setRole] = useState<Role>('user')
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '', companyName: '' })
  const [loading, setLoading] = useState(false)

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleRegister = async () => {
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      Toast.show({ type: 'error', text1: 'Vui lòng điền đầy đủ thông tin' })
      return
    }
    if (form.password !== form.confirmPassword) {
      Toast.show({ type: 'error', text1: 'Mật khẩu xác nhận không khớp' })
      return
    }
    if (role === 'employer' && !form.companyName) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập tên công ty' })
      return
    }
    setLoading(true)
    try {
      await register({
        fullName: form.fullName,
        email: form.email.trim().toLowerCase(),
        phone: form.phone,
        password: form.password,
        role,
        companyName: role === 'employer' ? form.companyName : undefined,
      })
      Toast.show({ type: 'success', text1: 'Đăng ký thành công!' })
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.message || 'Đăng ký thất bại' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.sub}>Bắt đầu hành trình của bạn 🚀</Text>
        </View>

        {/* Role selector */}
        <View style={styles.roleRow}>
          {(['user', 'employer'] as Role[]).map(r => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              style={[styles.roleBtn, role === r && styles.roleBtnActive]}
            >
              <Text style={styles.roleIcon}>{r === 'user' ? '👤' : '🏢'}</Text>
              <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                {r === 'user' ? 'Tìm việc' : 'Nhà tuyển dụng'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <Input label="Họ và tên *" value={form.fullName} onChangeText={set('fullName')} placeholder="Nguyễn Văn A" leftIcon={<User size={16} color={Colors.muted} />} />
          <Input label="Email *" value={form.email} onChangeText={set('email')} placeholder="example@email.com" keyboardType="email-address" autoCapitalize="none" leftIcon={<Mail size={16} color={Colors.muted} />} />
          <Input label="Số điện thoại *" value={form.phone} onChangeText={set('phone')} placeholder="0901234567" keyboardType="phone-pad" leftIcon={<Phone size={16} color={Colors.muted} />} />
          {role === 'employer' && (
            <Input label="Tên công ty *" value={form.companyName} onChangeText={set('companyName')} placeholder="Công ty TNHH ABC" leftIcon={<Building2 size={16} color={Colors.muted} />} />
          )}
          <Input label="Mật khẩu *" value={form.password} onChangeText={set('password')} placeholder="Tối thiểu 8 ký tự" secureTextEntry leftIcon={<Lock size={16} color={Colors.muted} />} />
          <Input label="Xác nhận mật khẩu *" value={form.confirmPassword} onChangeText={set('confirmPassword')} placeholder="Nhập lại mật khẩu" secureTextEntry leftIcon={<Lock size={16} color={Colors.muted} />} />
        </View>

        <Button title="Đăng ký" onPress={handleRegister} loading={loading} fullWidth />

        <TouchableOpacity style={styles.loginRow} onPress={() => router.back()}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <Text style={styles.loginLink}>Đăng nhập</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  content: { flexGrow: 1, padding: 20, gap: 20, paddingTop: 60 },
  header: { gap: 4 },
  title: { color: Colors.text, fontSize: 26, fontWeight: '800' },
  sub:   { color: Colors.muted, fontSize: 14 },

  roleRow: { flexDirection: 'row', gap: 10 },
  roleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12, borderWidth: 1,
    borderColor: Colors.border, backgroundColor: Colors.card,
  },
  roleBtnActive:  { borderColor: Colors.yellow, backgroundColor: `${Colors.yellow}15` },
  roleIcon:       { fontSize: 18 },
  roleText:       { color: Colors.muted, fontWeight: '600' },
  roleTextActive: { color: Colors.yellow },

  form: { gap: 14 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 20 },
  loginText: { color: Colors.muted, fontSize: 14 },
  loginLink: { color: Colors.yellow, fontSize: 14, fontWeight: '600' },
})
