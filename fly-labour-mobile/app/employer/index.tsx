import {
  View, Text, FlatList, StyleSheet, TouchableOpacity,
  RefreshControl, Alert, Modal, ScrollView, TextInput,
} from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import { Plus, Eye, Pencil, Trash2, X } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { employerApi } from '@/services/api'
import { formatSalary, formatDate } from '@/utils/helpers'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Job } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:         { label: 'Hoạt động',  color: Colors.green },
  paused:         { label: 'Tạm dừng',   color: Colors.appPending },
  closed:         { label: 'Đã đóng',    color: Colors.red },
  draft:          { label: 'Nháp',       color: Colors.muted },
  pending_review: { label: 'Chờ duyệt',  color: Colors.orange },
}

const COUNTRIES = [
  { value: 'australia', label: '🇦🇺 Úc' },
  { value: 'canada', label: '🇨🇦 Canada' },
  { value: 'new_zealand', label: '🇳🇿 New Zealand' },
  { value: 'germany', label: '🇩🇪 Đức' },
  { value: 'uk', label: '🇬🇧 Anh' },
  { value: 'norway', label: '🇳🇴 Na Uy' },
  { value: 'portugal', label: '🇵🇹 Bồ Đào Nha' },
  { value: 'czech', label: '🇨🇿 Séc' },
]

const EMPTY_FORM = {
  title: '', description: '', requirements: '', benefits: '',
  location: '', country: 'australia', salaryMin: '', salaryMax: '',
  salaryCurrency: 'AUD', slots: '', deadline: '',
}

export default function EmployerJobsScreen() {
  const router = useRouter()
  const qc = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)
  const [modal, setModal] = useState(false)
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const { data, refetch } = useQuery<{ data: Job[] }>({
    queryKey: ['employer-jobs'],
    queryFn: () => employerApi.getMyJobs().then(r => r.data),
  })

  const jobs = data?.data ?? []

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [])

  const openCreate = () => {
    setEditJob(null)
    setForm(EMPTY_FORM)
    setModal(true)
  }

  const openEdit = (job: Job) => {
    setEditJob(job)
    setForm({
      title: job.title,
      description: job.description,
      requirements: job.requirements ?? '',
      benefits: job.benefits ?? '',
      location: job.location ?? '',
      country: job.country ?? 'australia',
      salaryMin: job.salaryMin?.toString() ?? '',
      salaryMax: job.salaryMax?.toString() ?? '',
      salaryCurrency: job.salaryCurrency ?? 'AUD',
      slots: job.slots?.toString() ?? '',
      deadline: job.deadline ?? '',
    })
    setModal(true)
  }

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập tiêu đề và mô tả' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        slots: form.slots ? Number(form.slots) : undefined,
        deadline: form.deadline || undefined,
      }
      if (editJob) {
        await employerApi.updateJob(editJob.id, payload)
        Toast.show({ type: 'success', text1: 'Đã cập nhật tin đăng ✅' })
      } else {
        await employerApi.createJob(payload)
        Toast.show({ type: 'success', text1: 'Đã đăng tin tuyển dụng ✅' })
      }
      setModal(false)
      refetch()
    } catch (err: any) {
      Toast.show({ type: 'error', text1: err?.response?.data?.message || 'Lưu thất bại' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Xóa tin đăng', `Bạn có chắc muốn xóa "${title}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive',
        onPress: async () => {
          try {
            await employerApi.deleteJob(id)
            Toast.show({ type: 'success', text1: 'Đã xóa tin đăng' })
            refetch()
          } catch {
            Toast.show({ type: 'error', text1: 'Xóa thất bại' })
          }
        },
      },
    ])
  }

  const set = (k: keyof typeof EMPTY_FORM) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const renderItem = ({ item }: { item: Job }) => {
    const cfg = STATUS_CONFIG[item.status] ?? { label: item.status, color: Colors.muted }
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle} numberOfLines={2}>{item.title}</Text>
            {item.company && <Text style={styles.company}>{item.company}</Text>}
          </View>
          <Badge label={cfg.label} color={cfg.color} size="sm" />
        </View>

        <Text style={styles.salary}>{formatSalary(item.salaryMin, item.salaryMax, item.salaryCurrency)}</Text>

        <View style={styles.meta}>
          <Text style={styles.metaText}>📍 {item.location || item.country}</Text>
          {!!item.slots && <Text style={styles.metaText}>👥 {item.slots} chỉ tiêu</Text>}
          {item.deadline && <Text style={styles.metaText}>⏰ {formatDate(item.deadline)}</Text>}
          <Text style={styles.metaText}>👁 {item.viewCount} lượt xem</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => router.push(`/jobs/${item.id}`)} style={styles.actionBtn}>
            <Eye size={15} color={Colors.blue} />
            <Text style={[styles.actionText, { color: Colors.blue }]}>Xem</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openEdit(item)} style={styles.actionBtn}>
            <Pencil size={15} color={Colors.yellow} />
            <Text style={[styles.actionText, { color: Colors.yellow }]}>Sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id, item.title)} style={styles.actionBtn}>
            <Trash2 size={15} color={Colors.red} />
            <Text style={[styles.actionText, { color: Colors.red }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Tổng', value: jobs.length },
          { label: 'Hoạt động', value: jobs.filter(j => j.status === 'active').length },
          { label: 'Chờ duyệt', value: jobs.filter(j => j.status === 'pending_review').length },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.yellow} />}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>Chưa có tin đăng</Text>
            <Text style={styles.emptyText}>Nhấn nút + để đăng tin tuyển dụng đầu tiên</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity onPress={openCreate} style={styles.fab}>
        <Plus size={24} color={Colors.dark} />
      </TouchableOpacity>

      {/* Create/Edit Modal */}
      <Modal visible={modal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editJob ? 'Chỉnh sửa tin đăng' : 'Đăng tin tuyển dụng'}</Text>
            <TouchableOpacity onPress={() => setModal(false)}>
              <X size={22} color={Colors.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <View style={styles.modalForm}>
              <Input label="Tiêu đề *" value={form.title} onChangeText={set('title')} placeholder="VD: Lao động nông nghiệp Úc" />
              <Input label="Mô tả công việc *" value={form.description} onChangeText={set('description')} placeholder="Mô tả chi tiết công việc..." multiline numberOfLines={4} />
              <Input label="Yêu cầu" value={form.requirements} onChangeText={set('requirements')} placeholder="Yêu cầu ứng viên..." multiline numberOfLines={3} />
              <Input label="Quyền lợi" value={form.benefits} onChangeText={set('benefits')} placeholder="Phúc lợi, đãi ngộ..." multiline numberOfLines={3} />
              <Input label="Địa điểm" value={form.location} onChangeText={set('location')} placeholder="VD: Sydney, NSW" />

              {/* Country picker */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Quốc gia</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    {COUNTRIES.map(c => (
                      <TouchableOpacity
                        key={c.value}
                        onPress={() => setForm(f => ({ ...f, country: c.value }))}
                        style={[styles.chip, form.country === c.value && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, form.country === c.value && styles.chipTextActive]}>{c.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Input label="Lương tối thiểu" value={form.salaryMin} onChangeText={set('salaryMin')} placeholder="2000" keyboardType="numeric" />
                </View>
                <View style={{ flex: 1 }}>
                  <Input label="Lương tối đa" value={form.salaryMax} onChangeText={set('salaryMax')} placeholder="3000" keyboardType="numeric" />
                </View>
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Input label="Tiền tệ" value={form.salaryCurrency} onChangeText={set('salaryCurrency')} placeholder="AUD" />
                </View>
                <View style={{ flex: 1 }}>
                  <Input label="Số chỉ tiêu" value={form.slots} onChangeText={set('slots')} placeholder="10" keyboardType="numeric" />
                </View>
              </View>

              <Input label="Hạn nộp (YYYY-MM-DD)" value={form.deadline} onChangeText={set('deadline')} placeholder="2025-12-31" />
            </View>

            <View style={styles.modalFooter}>
              <Button title={editJob ? 'Lưu thay đổi' : 'Đăng tin'} onPress={handleSave} loading={saving} fullWidth size="lg" />
              <Button title="Hủy" onPress={() => setModal(false)} variant="ghost" fullWidth />
            </View>
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },

  statsRow: { flexDirection: 'row', gap: 10, padding: 16 },
  statCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 12, alignItems: 'center', gap: 4 },
  statValue: { color: Colors.yellow, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.muted, fontSize: 11 },

  list: { paddingHorizontal: 16, paddingBottom: 100 },

  card: { backgroundColor: Colors.card, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 10 },
  cardHeader: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  jobTitle:   { color: Colors.text, fontSize: 15, fontWeight: '600', lineHeight: 22 },
  company:    { color: Colors.muted, fontSize: 12, marginTop: 2 },
  salary:     { color: Colors.yellow, fontSize: 13, fontWeight: '600' },
  meta:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metaText:   { color: Colors.muted, fontSize: 12 },
  actions:    { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 10 },
  actionBtn:  { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.surface },
  actionText: { fontSize: 13, fontWeight: '500' },

  empty:      { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  emptyText:  { color: Colors.muted, fontSize: 13, textAlign: 'center' },

  fab: {
    position: 'absolute', bottom: 24, right: 20,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.yellow,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.yellow, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8,
    elevation: 8,
  },

  modalContainer: { flex: 1, backgroundColor: Colors.dark },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border },
  modalTitle:  { color: Colors.text, fontSize: 18, fontWeight: '700' },
  modalBody:   { flex: 1 },
  modalForm:   { padding: 20, gap: 14 },
  modalFooter: { padding: 20, gap: 10 },

  fieldGroup: { gap: 4 },
  fieldLabel: { color: Colors.text, fontSize: 13, fontWeight: '500' },
  chip:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  chipActive: { borderColor: Colors.yellow, backgroundColor: `${Colors.yellow}15` },
  chipText:   { color: Colors.muted, fontSize: 13 },
  chipTextActive: { color: Colors.yellow },

  row: { flexDirection: 'row', gap: 12 },
})
