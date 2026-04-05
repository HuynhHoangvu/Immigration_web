import { useState, useEffect } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, ActivityIndicator, Image,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Clock, Users, Calendar, Eye, ChevronLeft, X, Paperclip, FileText } from 'lucide-react-native'
import * as DocumentPicker from 'expo-document-picker'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { jobsApi, applicationsApi, uploadApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { DatePicker } from '@/components/ui/DatePicker'
import { formatSalary, getCountryLabel, JOBTYPE_LABELS, formatDate, getImageUrl } from '@/utils/helpers'
import type { Job } from '@/types'

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const [applyModal, setApplyModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [cvFile, setCvFile] = useState<{ name: string; uri: string; mimeType?: string; file?: File } | null>(null)
  const [useSavedCv, setUseSavedCv] = useState(!!user?.cvUrl)
  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: '',
    address: user?.address || '',
    education: '',
    experience: '',
    languageLevel: '',
    coverLetter: '',
  })

  const { data: job, isLoading } = useQuery<Job>({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getOne(id).then(r => r.data),
    enabled: !!id,
  })

  // Sync form khi user load xong từ store (hydrate async)
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        fullName: f.fullName || user.fullName || '',
        email:    f.email    || user.email    || '',
        phone:    f.phone    || user.phone    || '',
        address:  f.address  || user.address  || '',
      }))
    }
  }, [user])

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const pickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword',
             'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    })
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0]
      setCvFile({
        name: asset.name,
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'application/pdf',
        file: (asset as any).file ?? undefined,
      })
    }
  }

  const handleApply = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      Toast.show({ type: 'error', text1: 'Vui lòng điền đầy đủ thông tin bắt buộc' })
      return
    }
    setSubmitting(true)
    try {
      // Loại bỏ field rỗng để tránh lỗi DB (vd: dateOfBirth: "")
      const cleanForm = Object.fromEntries(
        Object.entries(form).filter(([_, v]) => v !== '')
      )
      let cvUrl: string | undefined
      if (useSavedCv && user?.cvUrl) {
        cvUrl = user.cvUrl
      } else if (cvFile) {
        const fd = new FormData()
        if (cvFile.file) {
          fd.append('file', cvFile.file, cvFile.name)
        } else {
          fd.append('file', { uri: cvFile.uri, name: cvFile.name, type: cvFile.mimeType } as any)
        }
        const res = await uploadApi.uploadCv(fd)
        cvUrl = res.data.url
      }
      await applicationsApi.create({ ...cleanForm, jobId: id, ...(cvUrl ? { cvUrl } : {}) })
      Toast.show({ type: 'success', text1: 'Nộp đơn thành công! 🎉', text2: 'Chúng tôi sẽ liên hệ sớm.' })
      setApplyModal(false)
      setCvFile(null)
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.message || 'Nộp đơn thất bại' })
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.yellow} />
      </View>
    )
  }
  if (!job) return null

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)')} style={styles.backBtn}>
          <ChevronLeft size={22} color={Colors.text} />
        </TouchableOpacity>

        {/* Cover image */}
        {job.image ? (
          <Image source={{ uri: getImageUrl(job.image) }} style={styles.coverImage} resizeMode="cover" />
        ) : (
          <View style={[styles.coverImage, styles.coverPlaceholder]}>
            <Text style={styles.coverEmoji}>{job.category?.icon || '💼'}</Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Title block */}
          <View style={styles.titleBlock}>
            <View style={styles.badgeRow}>
              {job.isHot && <Badge label="🔥 Hot" color={Colors.orange} />}
              {job.isFeatured && <Badge label="⭐ Nổi bật" color={Colors.yellow} />}
              {job.category && <Badge label={`${job.category.icon} ${job.category.name}`} color={Colors.blue} />}
            </View>
            <Text style={styles.title}>{job.title}</Text>
            {job.company && <Text style={styles.company}>{job.company}</Text>}
          </View>

          {/* Meta grid */}
          <View style={styles.metaGrid}>
            {[
              { icon: <MapPin size={14} color={Colors.muted} />, text: getCountryLabel(job.country) },
              { icon: <Clock size={14} color={Colors.muted} />, text: JOBTYPE_LABELS[job.jobType] },
              job.slots && { icon: <Users size={14} color={Colors.muted} />, text: `${job.slots} chỉ tiêu` },
              job.deadline && { icon: <Calendar size={14} color={Colors.muted} />, text: `Hạn: ${formatDate(job.deadline)}` },
              { icon: <Eye size={14} color={Colors.muted} />, text: `${job.viewCount} lượt xem` },
            ].filter(Boolean).map((item: any, i) => (
              <View key={i} style={styles.metaItem}>
                {item.icon}
                <Text style={styles.metaText}>{item.text}</Text>
              </View>
            ))}
          </View>

          {/* Salary */}
          <View style={styles.salaryBox}>
            <Text style={styles.salaryLabel}>Mức lương</Text>
            <Text style={styles.salaryValue}>
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </Text>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả công việc</Text>
            <Text style={styles.bodyText}>{job.description}</Text>
          </View>

          {job.requirements && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Yêu cầu</Text>
              <Text style={styles.bodyText}>{job.requirements}</Text>
            </View>
          )}

          {job.benefits && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quyền lợi</Text>
              <Text style={styles.bodyText}>{job.benefits}</Text>
            </View>
          )}

          <View style={{ height: 16 }} />
        </View>
      </ScrollView>

      {/* Apply bar — luôn hiển thị ở cuối */}
      {user?.role === 'user' && (
        <View style={styles.applyBar}>
          <Button title="Nộp đơn ngay" onPress={() => setApplyModal(true)} fullWidth size="lg" />
        </View>
      )}
      {!user && (
        <View style={styles.applyBar}>
          <View style={styles.guestApplyRow}>
            <Button title="Đăng nhập để nộp đơn" onPress={() => router.push('/(auth)/login')} fullWidth size="lg" />
            <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.registerLink}>
              <Text style={styles.registerLinkText}>Chưa có tài khoản? <Text style={{ color: Colors.yellow }}>Đăng ký</Text></Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Apply Modal */}
      <Modal visible={applyModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setApplyModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nộp đơn ứng tuyển</Text>
            <TouchableOpacity onPress={() => setApplyModal(false)}>
              <X size={22} color={Colors.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.modalSubtitle}>{job.title}</Text>
            <View style={styles.modalForm}>
              <Input label="Họ và tên *" value={form.fullName} onChangeText={set('fullName')} placeholder="Nguyễn Văn A" />
              <Input label="Email *" value={form.email} onChangeText={set('email')} placeholder="email@example.com" keyboardType="email-address" />
              <Input label="Số điện thoại *" value={form.phone} onChangeText={set('phone')} placeholder="0901234567" keyboardType="phone-pad" />
              <DatePicker label="Ngày sinh" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
              <Input label="Địa chỉ" value={form.address} onChangeText={set('address')} placeholder="Tỉnh / Thành phố" />
              <Input label="Trình độ học vấn" value={form.education} onChangeText={set('education')} placeholder="VD: Cao đẳng, Đại học..." />
              <Input label="Kinh nghiệm" value={form.experience} onChangeText={set('experience')} placeholder="Mô tả kinh nghiệm làm việc..." multiline numberOfLines={3} />
              <Input label="Trình độ ngoại ngữ" value={form.languageLevel} onChangeText={set('languageLevel')} placeholder="VD: Tiếng Anh B1, IELTS 5.5..." />
              <Input label="Thư giới thiệu" value={form.coverLetter} onChangeText={set('coverLetter')} placeholder="Viết vài dòng giới thiệu bản thân..." multiline numberOfLines={4} />

              {/* CV Upload */}
              <View style={styles.cvBlock}>
                <Text style={styles.cvLabel}>Đính kèm CV (PDF/Word)</Text>

                {user?.cvUrl && (
                  <TouchableOpacity
                    onPress={() => { setUseSavedCv(v => !v); setCvFile(null) }}
                    style={[styles.cvPicker, useSavedCv && styles.cvPickerActive]}
                    activeOpacity={0.7}
                  >
                    <FileText size={16} color={useSavedCv ? Colors.green : Colors.muted} />
                    <Text style={[styles.cvPickerText, useSavedCv && { color: Colors.green }]} numberOfLines={1}>
                      {useSavedCv ? '✓ Dùng CV đã lưu trong hồ sơ' : 'Dùng CV đã lưu trong hồ sơ'}
                    </Text>
                  </TouchableOpacity>
                )}

                {!useSavedCv && (
                  <>
                    <TouchableOpacity onPress={pickCV} style={styles.cvPicker} activeOpacity={0.7}>
                      <Paperclip size={16} color={Colors.yellow} />
                      <Text style={styles.cvPickerText} numberOfLines={1}>
                        {cvFile ? cvFile.name : 'Hoặc chọn file CV khác...'}
                      </Text>
                    </TouchableOpacity>
                    {cvFile && (
                      <TouchableOpacity onPress={() => setCvFile(null)}>
                        <Text style={styles.cvRemove}>✕ Xóa file</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            </View>
            <View style={styles.modalFooter}>
              <Button title="Gửi đơn" onPress={handleApply} loading={submitting} fullWidth size="lg" />
              <Button title="Hủy" onPress={() => setApplyModal(false)} variant="ghost" fullWidth />
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: Colors.dark },
  loadingWrap:  { flex: 1, backgroundColor: Colors.dark, alignItems: 'center', justifyContent: 'center' },
  backBtn:      { position: 'absolute', top: 50, left: 16, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: `${Colors.dark}cc`, alignItems: 'center', justifyContent: 'center' },
  coverImage:   { width: '100%', height: 220 },
  coverPlaceholder: { backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  coverEmoji:   { fontSize: 60 },

  content:     { padding: 16, gap: 16 },
  titleBlock:  { gap: 8 },
  badgeRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  title:       { color: Colors.text, fontSize: 22, fontWeight: '800', lineHeight: 30 },
  company:     { color: Colors.muted, fontSize: 15 },

  metaGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metaItem:  { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.surface, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  metaText:  { color: Colors.muted, fontSize: 12 },

  salaryBox:   { backgroundColor: `${Colors.yellow}10`, borderWidth: 1, borderColor: `${Colors.yellow}30`, borderRadius: 14, padding: 16, gap: 4 },
  salaryLabel: { color: Colors.muted, fontSize: 12, fontWeight: '500' },
  salaryValue: { color: Colors.yellow, fontSize: 18, fontWeight: '700' },

  section:      { gap: 8 },
  sectionTitle: { color: Colors.text, fontSize: 16, fontWeight: '700' },
  bodyText:     { color: Colors.muted, fontSize: 14, lineHeight: 22 },

  screen: { flex: 1, backgroundColor: Colors.dark },
  applyBar: {
    padding: 16, paddingBottom: 24,
    backgroundColor: Colors.dark,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },

  modalContainer: { flex: 1, backgroundColor: Colors.dark },
  modalHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle:     { color: Colors.text, fontSize: 18, fontWeight: '700' },
  modalSubtitle:  { color: Colors.muted, fontSize: 14, marginBottom: 16, paddingHorizontal: 20 },
  modalBody:      { flex: 1 },
  modalForm:      { padding: 20, gap: 14 },
  modalFooter:    { padding: 20, gap: 10 },

  guestApplyRow:    { gap: 8 },
  registerLink:     { alignItems: 'center', paddingVertical: 4 },
  registerLinkText: { color: Colors.muted, fontSize: 13 },

  cvBlock:      { gap: 6 },
  cvLabel:      { color: Colors.text, fontSize: 13, fontWeight: '500' },
  cvPicker: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed',
    borderRadius: 10, padding: 12, backgroundColor: Colors.surface,
  },
  cvPickerActive: {
    borderColor: Colors.green, borderStyle: 'solid', backgroundColor: `${Colors.green}10`,
  },
  cvPickerText: { flex: 1, color: Colors.muted, fontSize: 13 },
  cvRemove:     { color: Colors.red, fontSize: 12, marginTop: 2 },
})
