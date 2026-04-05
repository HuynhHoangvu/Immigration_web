import { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import * as DocumentPicker from 'expo-document-picker'
import Toast from 'react-native-toast-message'
import { ChevronLeft, FileText, Upload, Trash2, ExternalLink } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { uploadApi, usersApi } from '@/services/api'
import { Button } from '@/components/ui/Button'

export default function CvScreen() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [uploading, setUploading] = useState(false)

  const pickAndUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    })
    if (result.canceled || !result.assets[0]) return

    const asset = result.assets[0]
    setUploading(true)
    try {
      const fd = new FormData()
      if ((asset as any).file) {
        fd.append('file', (asset as any).file, asset.name)
      } else {
        fd.append('file', { uri: asset.uri, name: asset.name, type: asset.mimeType ?? 'application/pdf' } as any)
      }
      const uploadRes = await uploadApi.uploadCv(fd)
      const cvUrl = uploadRes.data.url

      const updateRes = await usersApi.updateMe({ cvUrl })
      setUser(updateRes.data)
      Toast.show({ type: 'success', text1: 'Tải lên CV thành công!' })
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.message || 'Tải lên thất bại' })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = () => {
    Alert.alert('Xóa CV', 'Bạn có chắc muốn xóa CV đã lưu?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive',
        onPress: async () => {
          try {
            const res = await usersApi.updateMe({ cvUrl: '' })
            setUser(res.data)
            Toast.show({ type: 'success', text1: 'Đã xóa CV' })
          } catch {
            Toast.show({ type: 'error', text1: 'Xóa thất bại' })
          }
        },
      },
    ])
  }

  const hasCv = !!user?.cvUrl

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CV của tôi</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.body}>
        {hasCv ? (
          <View style={styles.cvCard}>
            <View style={styles.cvIcon}>
              <FileText size={36} color={Colors.yellow} />
            </View>
            <Text style={styles.cvTitle}>CV đã lưu</Text>
            <Text style={styles.cvSub} numberOfLines={2}>{user.cvUrl}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => Linking.openURL(user.cvUrl!)}
                activeOpacity={0.7}
              >
                <ExternalLink size={16} color={Colors.blue} />
                <Text style={[styles.actionText, { color: Colors.blue }]}>Xem CV</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.actionBtnDanger]}
                onPress={handleDelete}
                activeOpacity={0.7}
              >
                <Trash2 size={16} color={Colors.red} />
                <Text style={[styles.actionText, { color: Colors.red }]}>Xóa</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />
            <Text style={styles.replaceHint}>Muốn thay CV khác?</Text>
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <FileText size={52} color={Colors.muted} />
            <Text style={styles.emptyTitle}>Chưa có CV</Text>
            <Text style={styles.emptyText}>
              Tải lên CV để dùng nhanh khi nộp đơn ứng tuyển
            </Text>
          </View>
        )}

        <Button
          title={hasCv ? 'Thay CV mới' : 'Tải lên CV (PDF/Word)'}
          onPress={pickAndUpload}
          loading={uploading}
          fullWidth
          size="lg"
        />

        <Text style={styles.hint}>Hỗ trợ PDF, DOC, DOCX — tối đa 20MB</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.dark },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn:     { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: Colors.text, fontSize: 17, fontWeight: '700' },

  body: { flex: 1, padding: 20, gap: 16 },

  cvCard: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: `${Colors.yellow}40`,
    borderRadius: 16, padding: 20, alignItems: 'center', gap: 10,
  },
  cvIcon:  { width: 72, height: 72, borderRadius: 36, backgroundColor: `${Colors.yellow}15`, alignItems: 'center', justifyContent: 'center' },
  cvTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  cvSub:   { color: Colors.muted, fontSize: 11, textAlign: 'center' },

  actions:        { flexDirection: 'row', gap: 12, marginTop: 4 },
  actionBtn:      { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 99, borderWidth: 1, borderColor: Colors.border },
  actionBtnDanger:{ borderColor: `${Colors.red}50` },
  actionText:     { fontSize: 13, fontWeight: '600' },

  divider:     { height: 1, width: '100%', backgroundColor: Colors.border, marginVertical: 4 },
  replaceHint: { color: Colors.muted, fontSize: 12 },

  emptyCard: {
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: 16, padding: 32, alignItems: 'center', gap: 12,
  },
  emptyTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  emptyText:  { color: Colors.muted, fontSize: 13, textAlign: 'center', lineHeight: 20 },

  hint: { color: Colors.muted, fontSize: 12, textAlign: 'center' },
})
