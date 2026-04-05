import { ScrollView, View, Text, StyleSheet, RefreshControl } from 'react-native'
import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'expo-router'
import { ArrowRight } from 'lucide-react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/colors'
import { jobsApi, categoriesApi } from '@/services/api'
import { JobCard } from '@/components/jobs/JobCard'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import { HeroBanner } from '@/components/home/HeroBanner'
import { TouchableOpacity } from 'react-native'
import type { Job, Category } from '@/types'

export default function HomeScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [refreshing, setRefreshing] = useState(false)

  const { data: hotJobs, refetch: refetchHot } = useQuery<Job[]>({
    queryKey: ['jobs', 'hot'],
    queryFn: () => jobsApi.getHot().then(r => r.data),
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then(r => r.data),
  })

  const { data: featuredJobs, refetch: refetchFeatured } = useQuery<{ data: Job[] }>({
    queryKey: ['jobs', 'featured'],
    queryFn: () => jobsApi.getAll({ isFeatured: true, limit: 6 }).then(r => r.data),
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all([refetchHot(), refetchFeatured()])
    setRefreshing(false)
  }, [])

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.yellow} />}
      >
        <HeroBanner totalJobs={featuredJobs?.data?.length} />

        {/* Categories */}
        {categories && categories.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ngành nghề</Text>
            <CategoryGrid
              categories={categories}
              onSelect={(id) => router.push({ pathname: '/(tabs)/jobs', params: { categoryId: id } })}
            />
          </View>
        )}

        {/* Hot jobs */}
        {hotJobs && hotJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔥 Việc làm Hot</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')} style={styles.seeAll}>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
                <ArrowRight size={14} color={Colors.yellow} />
              </TouchableOpacity>
            </View>
            <View style={styles.jobList}>
              {hotJobs.slice(0, 5).map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          </View>
        )}

        {/* Featured jobs */}
        {featuredJobs?.data && featuredJobs.data.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⭐ Việc làm nổi bật</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/jobs')} style={styles.seeAll}>
                <Text style={styles.seeAllText}>Xem tất cả</Text>
                <ArrowRight size={14} color={Colors.yellow} />
              </TouchableOpacity>
            </View>
            <View style={styles.jobList}>
              {featuredJobs.data.slice(0, 4).map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.dark },
  container: { flex: 1 },
  section:   { marginBottom: 8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12 },
  sectionTitle:  { color: Colors.text, fontSize: 17, fontWeight: '700' },
  seeAll:        { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText:    { color: Colors.yellow, fontSize: 13, fontWeight: '500' },
  jobList:       { paddingHorizontal: 16, gap: 10 },
})
