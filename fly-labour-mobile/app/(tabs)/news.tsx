import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/colors'
import { newsApi } from '@/services/api'
import { timeAgo, getImageUrl } from '@/utils/helpers'
import type { News } from '@/types'

export default function NewsScreen() {
  const insets = useSafeAreaInsets()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)

  const { data, refetch } = useQuery<{ data: News[] }>({
    queryKey: ['news'],
    queryFn: () => newsApi.getAll({ limit: 30 }).then(r => r.data),
  })

  const news = data?.data ?? []

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [])

  const renderItem = ({ item }: { item: News }) => (
    <TouchableOpacity
      onPress={() => router.push(`/news/${item.slug}`)}
      style={styles.card}
      activeOpacity={0.8}
    >
      {item.image ? (
        <Image source={{ uri: getImageUrl(item.image) }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Text style={{ fontSize: 32 }}>📰</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        {item.excerpt && <Text style={styles.cardExcerpt} numberOfLines={2}>{item.excerpt}</Text>}
        <Text style={styles.cardDate}>{timeAgo(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Tin tức</Text>
        <Text style={styles.count}>{news.length} bài viết</Text>
      </View>

      <FlatList
        data={news}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.yellow} />}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ fontSize: 48 }}>📰</Text>
            <Text style={styles.emptyTitle}>Chưa có tin tức</Text>
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
    overflow: 'hidden',
  },
  cardImage: { width: '100%', height: 180 },
  cardImagePlaceholder: { backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  cardBody:    { padding: 14, gap: 6 },
  cardTitle:   { color: Colors.text, fontSize: 15, fontWeight: '700', lineHeight: 22 },
  cardExcerpt: { color: Colors.muted, fontSize: 13, lineHeight: 20 },
  cardDate:    { color: Colors.muted, fontSize: 12 },

  empty:      { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyTitle: { color: Colors.text, fontSize: 16, fontWeight: '600' },
})
