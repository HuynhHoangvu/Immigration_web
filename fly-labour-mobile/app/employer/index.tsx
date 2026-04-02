import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import { Plus, Eye, Pause, Play, Trash2 } from 'lucide-react-native'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { employerApi } from '@/services/api'
import { formatSalary, formatDate } from '@/utils/helpers'
import { Badge } from '@/components/ui/Badge'
import type { Job } from '@/types'

const STATUS_CONFIG = {
  active:         { label: 'Hoạt động',  color: Colors.green },
  paused:         { label: 'Tạm dừng',   color: Colors.appPending },
  closed:         { label: 'Đã đóng',    color: Colors.red },
  draft:          { label: 'Nháp',       color: Colors.muted },
  pending_review: { label: 'Chờ duyệt',  color: Colors.orange },
}

export default function EmployerJobsScreen() {
  const router = useRouter()
  const qc = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

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

  const renderItem = ({ item }: { item: Job }) => {
    const cfg = STATUS_CONFIG[item.status]
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
          {item.slots && <Text style={styles.metaText}>👥 {item.slots} chỉ tiêu</Text>}
          {item.deadline && <Text style={styles.metaText}>⏰ {formatDate(item.deadline)}</Text>}
          <Text style={styles.metaText}>👁 {item.viewCount} lượt xem</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => router.push(`/jobs/${item.id}`)}
            style={styles.actionBtn}
          >
            <Eye size={15} color={Colors.blue} />
            <Text style={[styles.actionText, { color: Colors.blue }]}>Xem</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id, item.title)}
            style={styles.actionBtn}
          >
            <Trash2 size={15} color={Colors.red} />
            <Text style={[styles.actionText, { color: Colors.red }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Stats bar */}
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
            <Text style={styles.emptyText}>Đăng tin tuyển dụng đầu tiên của bạn</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.dark },

  statsRow: { flexDirection: 'row', gap: 10, padding: 16 },
  statCard: { flex: 1, backgroundColor: Colors.card, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 12, alignItems: 'center', gap: 4 },
  statValue: { color: Colors.yellow, fontSize: 22, fontWeight: '800' },
  statLabel: { color: Colors.muted, fontSize: 11 },

  list: { paddingHorizontal: 16, paddingBottom: 20 },

  card: {
    backgroundColor: Colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 10,
  },
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
})
