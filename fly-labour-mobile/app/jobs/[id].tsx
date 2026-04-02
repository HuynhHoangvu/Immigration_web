import { useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, TextInput, Alert, ActivityIndicator, Image,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Clock, Users, Calendar, Eye, ChevronLeft, X } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { jobsApi, applicationsApi } from '@/services/api'
import { useAuthStore } from '@/store/authStore'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { formatSalary, getCountryLabel, JOBTYPE_LABELS, formatDate, getImageUrl } from '@/utils/helpers'
import type { Job } from '@/types'

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { user } = useAuthStore()
  const [applyModal, setApplyModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
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

  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleApply = async () => {
    if (!form.fullName || !form.email || !form.phone) {
      Toast.show({ type: 'error', text1: 'Vui lòng điền đầy đủ thông tin bắt buộc' })
      return
    }
    setSubmitting(true)
    try {
      await applicationsApi.create({ ...form, jobId: id })
      Toast.show({ type: 'success', text1: 'Nộp đơn thành công! 🎉', text2: 'Chúng tôi sẽ liên hệ sớm.' })
      setApplyModal(false)
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
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
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

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Apply button sticky */}
      {user?.role === 'user' && (
        <View style={styles.applyBar}>
          <Button title="Nộp đơn ngay" onPress={() => setApplyModal(true)} fullWidth size="lg" />
        </View>
      )}

      {/* Apply Modal */}
      <Modal visible={applyModal} animationType="slide" presentationStyle="pageSheet">
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
              <Input label="Ngày sinh" value={form.dateOfBirth} onChangeText={set('dateOfBirth')} placeholder="DD/MM/YYYY" />
              <Input label="Địa chỉ" value={form.address} onChangeText={set('address')} placeholder="Tỉnh / Thành phố" />
              <Input label="Trình độ học vấn" value={form.education} onChangeText={set('education')} placeholder="VD: Cao đẳng, Đại học..." />
              <Input label="Kinh nghiệm" value={form.experience} onChangeText={set('experience')} placeholder="Mô tả kinh nghiệm làm việc..." multiline numberOfLines={3} />
              <Input label="Trình độ ngoại ngữ" value={form.languageLevel} onChangeText={set('languageLevel')} placeholder="VD: Tiếng Anh B1, IELTS 5.5..." />
              <Input label="Thư giới thiệu" value={form.coverLetter} onChangeText={set('coverLetter')} placeholder="Viết vài dòng giới thiệu bản thân..." multiline numberOfLines={4} />
            </View>
            <View style={styles.modalFooter}>
              <Button title="Gửi đơn" onPress={handleApply} loading={submitting} fullWidth size="lg" />
              <Button title="Hủy" onPress={() => setApplyModal(false)} variant="ghost" fullWidth />
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </>
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

  applyBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 16, paddingBottom: 32,
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
})
