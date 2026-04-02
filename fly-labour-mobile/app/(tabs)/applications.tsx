import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors'
import { applicationsApi, employerApi } from '@/services/api'
import { APP_STATUS_CONFIG, formatDate } from '@/utils/helpers'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore } from '@/store/authStore'
import type { Application } from '@/types'

export default function ApplicationsScreen() {
  const user = useAuthStore(s => s.user)
  const isEmployer = user?.role === 'employer'
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const { data: myApps, refetch: refetchUser } = useQuery<Application[]>({
    queryKey: ['my-applications'],
    queryFn: () => applicationsApi.getMy().then(r => r.data),
    enabled: !isEmployer,
  })

  const { data: empApps, refetch: refetchEmp } = useQuery<Application[]>({
    queryKey: ['employer-applications'],
    queryFn: () => employerApi.getApplications().then(r => r.data),
    enabled: isEmployer,
  })

  const apps = isEmployer ? (empApps ?? []) : (myApps ?? [])

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    if (isEmployer) await refetchEmp()
    else await refetchUser()
    setRefreshing(false)
  }, [isEmployer])

  const renderItem = ({ item }: { item: Application }) => {
    const cfg = APP_STATUS_CONFIG[item.status]
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
          </View>
        )}
        <View style={styles.cardFooter}>
          <Text style={styles.dateText}>Nộp: {formatDate(item.createdAt)}</Text>
          {item.adminNote && (
            <Text style={styles.noteText} numberOfLines={1}>📝 {item.adminNote}</Text>
          )}
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
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
    </SafeAreaView>
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
  applicantRow: { flexDirection: 'row', gap: 6 },
  metaLabel:    { color: Colors.muted, fontSize: 13 },
  metaValue:    { color: Colors.text, fontSize: 13, fontWeight: '500' },
  cardFooter:   { flexDirection: 'row', justifyContent: 'space-between' },
  dateText:     { color: Colors.muted, fontSize: 12 },
  noteText:     { color: Colors.muted, fontSize: 12, flex: 1, textAlign: 'right' },

  empty:      { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyIcon:  { fontSize: 48 },
  emptyTitle: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  emptyText:  { color: Colors.muted, fontSize: 13, textAlign: 'center' },
})
