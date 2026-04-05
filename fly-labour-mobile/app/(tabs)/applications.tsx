import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'
import { Colors } from '@/constants/colors'
import { applicationsApi, employerApi } from '@/services/api'
import { APP_STATUS_CONFIG, formatDate } from '@/utils/helpers'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import type { Application } from '@/types'

export default function ApplicationsScreen() {
  const user = useAuthStore(s => s.user)
  const isEmployer = user?.role === 'employer'
  const router = useRouter()
  const qc = useQueryClient()
  const [refreshing, setRefreshing] = useState(false)

  const { data: myApps, refetch: refetchUser } = useQuery<Application[]>({
    queryKey: ['my-applications'],
    queryFn: () => applicationsApi.getMy().then(r => r.data),
    enabled: !isEmployer && !!user,
  })

  const { data: empApps, refetch: refetchEmp } = useQuery<Application[]>({
    queryKey: ['employer-applications'],
    queryFn: () => employerApi.getApplications().then(r => r.data),
    enabled: isEmployer,
  })

  const apps = isEmployer ? (empApps ?? []) : (myApps ?? [])
  const insets = useSafeAreaInsets()

  if (!user) {
    return (
      <View style={[styles.safe, { paddingTop: insets.top }]}>
        <View style={styles.guestWrap}>
          <Text style={styles.guestIcon}>📄</Text>
          <Text style={styles.guestTitle}>Đăng nhập để xem đơn</Text>
          <Text style={styles.guestText}>Theo dõi trạng thái đơn ứng tuyển của bạn tại đây</Text>
          <View style={styles.guestBtns}>
            <Button title="Đăng nhập" onPress={() => router.push('/(auth)/login')} fullWidth />
            <Button title="Đăng ký" onPress={() => router.push('/(auth)/register')} variant="outline" fullWidth />
          </View>
        </View>
      </View>
    )
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (isEmployer) await refetchEmp()
    else await refetchUser()
    setRefreshing(false)
  }, [isEmployer, refetchEmp, refetchUser])

  const handleWithdraw = (id: string) => {
    Alert.alert('Rút đơn', 'Bạn có chắc muốn rút đơn này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Rút đơn', style: 'destructive',
        onPress: async () => {
          try {
            await applicationsApi.withdraw(id)
            Toast.show({ type: 'success', text1: 'Đã rút đơn' })
            refetchUser()
          } catch {
            Toast.show({ type: 'error', text1: 'Rút đơn thất bại' })
          }
        },
      },
    ])
  }

  const handleEmployerStatus = (id: string, status: 'approved' | 'rejected') => {
    const label = status === 'approved' ? 'duyệt' : 'từ chối'
    Alert.alert(
      status === 'approved' ? 'Duyệt đơn' : 'Từ chối đơn',
      `Bạn có chắc muốn ${label} đơn này?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: status === 'approved' ? 'Duyệt' : 'Từ chối',
          style: status === 'rejected' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              await employerApi.updateApplicationStatus(id, status)
              Toast.show({ type: 'success', text1: status === 'approved' ? 'Đã duyệt đơn ✅' : 'Đã từ chối đơn' })
              refetchEmp()
            } catch {
              Toast.show({ type: 'error', text1: 'Cập nhật thất bại' })
            }
          },
        },
      ]
    )
  }

  const renderItem = ({ item }: { item: Application }) => {
    const cfg = APP_STATUS_CONFIG[item.status] ?? { label: item.status, color: Colors.muted, bg: Colors.surface }
    const canWithdraw = !isEmployer && (item.status === 'pending' || item.status === 'reviewing')
    const canAct = isEmployer && (item.status === 'pending' || item.status === 'reviewing')

    return (
      <TouchableOpacity
        onPress={() => router.push(`/jobs/${item.jobId}`)}
        style={styles.card}
        activeOpacity={0.8}
      >
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle} numberOfLines={1}>{item.job?.title ?? 'Việc làm'}</Text>
            <Text style={styles.company} numberOfLines={1}>{item.job?.company}</Text>
          </View>
          <Badge label={cfg.label} color={cfg.color} bg={cfg.bg} size="sm" />
        </View>

        {isEmployer && (
          <View style={styles.applicantRow}>
            <Text style={styles.metaLabel}>Ứng viên:</Text>
            <Text style={styles.metaValue}>{item.fullName}</Text>
            <Text style={styles.metaLabel}>  •  </Text>
            <Text style={styles.metaValue}>{item.phone}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>Nộp: {formatDate(item.createdAt)}</Text>
          {item.adminNote && (
            <Text style={styles.noteText} numberOfLines={1}>📝 {item.adminNote}</Text>
          )}
        </View>

        {/* Employer actions */}
        {canAct && (
          <View style={styles.actionsRow}>
            <TouchableOpacity
              onPress={e => { e.stopPropagation?.(); handleEmployerStatus(item.id, 'approved') }}
              style={[styles.actionBtn, styles.approveBtn]}
            >
              <Text style={styles.approveTxt}>✓ Duyệt</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={e => { e.stopPropagation?.(); handleEmployerStatus(item.id, 'rejected') }}
              style={[styles.actionBtn, styles.rejectBtn]}
            >
              <Text style={styles.rejectTxt}>✕ Từ chối</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* User withdraw */}
        {canWithdraw && (
          <TouchableOpacity
            onPress={e => { e.stopPropagation?.(); handleWithdraw(item.id) }}
            style={styles.withdrawBtn}
          >
            <Text style={styles.withdrawTxt}>Rút đơn</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{isEmployer ? 'Danh sách ứng viên' : 'Đơn của tôi'}</Text>
        <Text style={styles.count}>{apps.length} đơn</Text>
      </View>

      <FlatList
        data={apps}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.yellow} />}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>{isEmployer ? '📋' : '📄'}</Text>
            <Text style={styles.emptyTitle}>Chưa có đơn nào</Text>
            <Text style={styles.emptyText}>
              {isEmployer ? 'Chưa có ứng viên nào nộp đơn' : 'Bạn chưa nộp đơn việc làm nào'}
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.dark },
  header: { paddingHorizontal: 16, paddingVertical: 14 },
  title:  { color: Colors.text, fontSize: 22, fontWeight: '800' },
  count:  { color: Colors.muted, fontSize: 13, marginTop: 2 },
  list:   { paddingHorizontal: 16, paddingBottom: 20 },

  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 8,
  },
  cardHeader:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  jobTitle:     { color: Colors.text, fontSize: 14, fontWeight: '600' },
  company:      { color: Colors.muted, fontSize: 12, marginTop: 2 },
  applicantRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  metaLabel:    { color: Colors.muted, fontSize: 13 },
  metaValue:    { color: Colors.text, fontSize: 13, fontWeight: '500' },
  cardFooter:   { flexDirection: 'row', justifyContent: 'space-between' },
  dateText:     { color: Colors.muted, fontSize: 12 },
  noteText:     { color: Colors.muted, fontSize: 12, flex: 1, textAlign: 'right' },

  actionsRow:  { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 8 },
  actionBtn:   { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  approveBtn:  { backgroundColor: `${Colors.green}20`, borderWidth: 1, borderColor: `${Colors.green}50` },
  approveTxt:  { color: Colors.green, fontSize: 13, fontWeight: '600' },
  rejectBtn:   { backgroundColor: `${Colors.red}15`, borderWidth: 1, borderColor: `${Colors.red}40` },
  rejectTxt:   { color: Colors.red, fontSize: 13, fontWeight: '600' },

  withdrawBtn: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface },
  withdrawTxt: { color: Colors.muted, fontSize: 12 },

  empty:      { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  emptyText:  { color: Colors.muted, fontSize: 13, textAlign: 'center' },

  guestWrap:  { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  guestIcon:  { fontSize: 56 },
  guestTitle: { color: Colors.text, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  guestText:  { color: Colors.muted, fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 8 },
  guestBtns:  { width: '100%', gap: 10 },
})
