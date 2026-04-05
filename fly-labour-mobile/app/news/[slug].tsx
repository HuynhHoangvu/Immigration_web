import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { newsApi } from '@/services/api'
import { formatDate, getImageUrl } from '@/utils/helpers'
import type { News } from '@/types'

export default function NewsDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const router = useRouter()

  const { data: article, isLoading } = useQuery<News>({
    queryKey: ['news', slug],
    queryFn: () => newsApi.getOne(slug).then(r => r.data),
    enabled: !!slug,
  })

  if (isLoading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={Colors.yellow} />
      </View>
    )
  }

  if (!article) return null

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity
          onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/news')}
          style={styles.backBtn}
        >
          <ChevronLeft size={22} color={Colors.text} />
        </TouchableOpacity>

        {article.image && (
          <Image source={{ uri: getImageUrl(article.image) }} style={styles.coverImage} resizeMode="cover" />
        )}

        <View style={styles.content}>
          <Text style={styles.date}>{formatDate(article.createdAt)}</Text>
          <Text style={styles.title}>{article.title}</Text>
          {article.excerpt && <Text style={styles.excerpt}>{article.excerpt}</Text>}
          <View style={styles.divider} />
          <Text style={styles.body}>{article.content}</Text>
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  screen:      { flex: 1, backgroundColor: Colors.dark },
  container:   { flex: 1 },
  loadingWrap: { flex: 1, backgroundColor: Colors.dark, alignItems: 'center', justifyContent: 'center' },

  backBtn: {
    position: 'absolute', top: 50, left: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: `${Colors.dark}cc`,
    alignItems: 'center', justifyContent: 'center',
  },
  coverImage: { width: '100%', height: 240 },

  content:  { padding: 20, gap: 12 },
  date:     { color: Colors.muted, fontSize: 13 },
  title:    { color: Colors.text, fontSize: 22, fontWeight: '800', lineHeight: 32 },
  excerpt:  { color: Colors.muted, fontSize: 15, lineHeight: 24, fontStyle: 'italic' },
  divider:  { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  body:     { color: Colors.text, fontSize: 15, lineHeight: 26 },
})
