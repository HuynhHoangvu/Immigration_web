import { useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { usersApi } from '@/services/api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function EditProfileScreen() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    website: user?.website || '',
  })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))
  const setPw = (k: keyof typeof pwForm) => (v: string) => setPwForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.fullName) { Toast.show({ type: 'error', text1: 'Vui lòng nhập họ tên' }); return }
    setSaving(true)
    try {
      const res = await usersApi.updateMe({
        fullName: form.fullName,
        phone: form.phone || undefined,
        address: form.address || undefined,
        companyName: form.companyName || undefined,
        companyDescription: form.companyDescription || undefined,
        website: form.website || undefined,
      })
      setUser(res.data)
      Toast.show({ type: 'success', text1: 'Cập nhật thành công!' })
      router.back()
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.message || 'Cập nhật thất bại' })
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      Toast.show({ type: 'error', text1: 'Điền đầy đủ các trường mật khẩu' }); return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      Toast.show({ type: 'error', text1: 'Mật khẩu mới không khớp' }); return
    }
    try {
      await usersApi.changePassword(pwForm)
      Toast.show({ type: 'success', text1: 'Đổi mật khẩu thành công!' })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.message || 'Đổi mật khẩu thất bại' })
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        <View style={styles.form}>
          <Input label="Họ và tên *" value={form.fullName} onChangeText={set('fullName')} placeholder="Nguyễn Văn A" />
          <Input label="Số điện thoại" value={form.phone} onChangeText={set('phone')} placeholder="0901234567" keyboardType="phone-pad" />
          <Input label="Địa chỉ" value={form.address} onChangeText={set('address')} placeholder="Tỉnh / Thành phố" />
        </View>
      </View>

      {user?.role === 'employer' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin công ty</Text>
          <View style={styles.form}>
            <Input label="Tên công ty" value={form.companyName} onChangeText={set('companyName')} placeholder="Công ty TNHH ABC" />
            <Input label="Giới thiệu công ty" value={form.companyDescription} onChangeText={set('companyDescription')} placeholder="Mô tả ngắn về công ty..." multiline numberOfLines={3} />
            <Input label="Website" value={form.website} onChangeText={set('website')} placeholder="https://company.com" keyboardType="url" autoCapitalize="none" />
          </View>
        </View>
      )}

      <Button title="Lưu thay đổi" onPress={handleSave} loading={saving} fullWidth />

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Đổi mật khẩu</Text>
        <View style={styles.form}>
          <Input label="Mật khẩu hiện tại" value={pwForm.currentPassword} onChangeText={setPw('currentPassword')} secureTextEntry placeholder="••••••••" />
          <Input label="Mật khẩu mới" value={pwForm.newPassword} onChangeText={setPw('newPassword')} secureTextEntry placeholder="Tối thiểu 8 ký tự" />
          <Input label="Xác nhận mật khẩu mới" value={pwForm.confirmPassword} onChangeText={setPw('confirmPassword')} secureTextEntry placeholder="Nhập lại mật khẩu mới" />
        </View>
        <Button title="Đổi mật khẩu" onPress={handleChangePassword} variant="outline" fullWidth />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },
  content:   { padding: 16, gap: 20 },
  section:   { gap: 12 },
  sectionTitle: { color: Colors.muted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  form:      { gap: 14 },
  divider:   { height: 1, backgroundColor: Colors.border },
})
