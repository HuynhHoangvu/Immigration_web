import { useState, useCallback } from 'react'
import {
  View, Text, TextInput, FlatList, StyleSheet,
  TouchableOpacity, RefreshControl, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { useLocalSearchParams } from 'expo-router'
import { Search, SlidersHorizontal, X } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { jobsApi, categoriesApi } from '@/services/api'
import { JobCard } from '@/components/jobs/JobCard'
import { CategoryGrid } from '@/components/home/CategoryGrid'
import type { Job, Category } from '@/types'

const COUNTRIES = [
  { value: '', label: '🌐 Tất cả' },
  { value: 'australia', label: '🇦🇺 Úc' },
  { value: 'canada', label: '🇨🇦 Canada' },
  { value: 'new_zealand', label: '🇳🇿 New Zealand' },
  { value: 'germany', label: '🇩🇪 Đức' },
  { value: 'uk', label: '🇬🇧 Anh' },
]

export default function JobsScreen() {
  const params = useLocalSearchParams<{ categoryId?: string }>()
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>(params.categoryId)
  const [country, setCountry] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getAll().then(r => r.data),
  })

  const { data, refetch, isLoading } = useQuery<{ data: Job[]; meta: any }>({
    queryKey: ['jobs', search, categoryId, country],
    queryFn: () => jobsApi.getAll({ search: search || undefined, categoryId: categoryId || undefined, country: country || undefined, limit: 50 }).then(r => r.data),
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [])

  const jobs = data?.data ?? []
  const hasFilters = !!(categoryId || country)

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Việc làm</Text>
        <TouchableOpacity onPress={() => setShowFilters(v => !v)} style={[styles.filterBtn, hasFilters && styles.filterBtnActive]}>
          <SlidersHorizontal size={16} color={hasFilters ? Colors.yellow : Colors.muted} />
          {hasFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Search size={16} color={Colors.muted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm việc làm, công ty..."
          placeholderTextColor={Colors.muted}
          selectionColor={Colors.yellow}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <X size={16} color={Colors.muted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersBlock}>
          <Text style={styles.filterLabel}>Danh mục</Text>
          {categories && (
            <CategoryGrid categories={categories} selected={categoryId} onSelect={setCategoryId} />
          )}
          <Text style={[styles.filterLabel, { marginTop: 8, paddingHorizontal: 16 }]}>Quốc gia</Text>
          <FlatList
            horizontal
            data={COUNTRIES}
            keyExtractor={i => i.value}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.countryRow}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setCountry(item.value)}
                style={[styles.countryChip, country === item.value && styles.countryChipActive]}
              >
                <Text style={[styles.countryText, country === item.value && styles.countryTextActive]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Results count */}
      <View style={styles.resultsRow}>
        <Text style={styles.resultsText}>{jobs.length} việc làm</Text>
        {hasFilters && (
          <TouchableOpacity onPress={() => { setCategoryId(undefined); setCountry('') }}>
            <Text style={styles.clearText}>Xóa bộ lọc</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={Colors.yellow} />
        </View>
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.yellow} />}
          renderItem={({ item }) => <JobCard job={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Không tìm thấy</Text>
              <Text style={styles.emptyText}>Thử thay đổi từ khóa hoặc bộ lọc</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.dark },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  title:  { color: Colors.text, fontSize: 22, fontWeight: '800' },
  filterBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  filterBtnActive: { borderColor: Colors.yellow },
  filterDot: { position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.yellow },

  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  searchIcon:  {},
  searchInput: { flex: 1, color: Colors.text, fontSize: 14 },

  filtersBlock: { paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, marginBottom: 10 },
  filterLabel:  { color: Colors.muted, fontSize: 12, fontWeight: '600', paddingHorizontal: 16, marginBottom: 8, textTransform: 'uppercase' },
  countryRow:   { paddingHorizontal: 16, gap: 8 },
  countryChip:  { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.card },
  countryChipActive: { borderColor: Colors.yellow, backgroundColor: `${Colors.yellow}15` },
  countryText:       { color: Colors.muted, fontSize: 13 },
  countryTextActive: { color: Colors.yellow },

  resultsRow:  { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 },
  resultsText: { color: Colors.muted, fontSize: 13 },
  clearText:   { color: Colors.yellow, fontSize: 13, fontWeight: '500' },

  list:       { paddingHorizontal: 16, paddingBottom: 20 },
  loadingWrap:{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },

  empty:      { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyIcon:  { fontSize: 40 },
  emptyTitle: { color: Colors.text, fontSize: 16, fontWeight: '600' },
  emptyText:  { color: Colors.muted, fontSize: 13 },
})
