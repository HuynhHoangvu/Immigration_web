import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { MapPin, Clock, Users } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { Badge } from '@/components/ui/Badge'
import { formatSalary, getCountryLabel, JOBTYPE_LABELS, getImageUrl, timeAgo } from '@/utils/helpers'
import type { Job } from '@/types'

interface Props {
  job: Job
  compact?: boolean
}

export function JobCard({ job, compact }: Props) {
  const router = useRouter()

  return (
    <TouchableOpacity
      onPress={() => router.push(`/jobs/${job.id}`)}
      activeOpacity={0.8}
      style={[styles.card, compact && styles.compact]}
    >
      {/* Header: image + title */}
      <View style={styles.header}>
        <View style={styles.imageWrap}>
          {job.image ? (
            <Image source={{ uri: getImageUrl(job.image) }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, styles.imagePlaceholder]}>
              <Text style={styles.imageEmoji}>{job.category?.icon || '💼'}</Text>
            </View>
          )}
        </View>
        <View style={styles.titleBlock}>
          <View style={styles.badges}>
            {job.isHot && <Badge label="🔥 Hot" color={Colors.orange} size="sm" />}
            {job.isFeatured && <Badge label="⭐ Nổi bật" color={Colors.yellow} size="sm" />}
          </View>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
          {job.company && <Text style={styles.company} numberOfLines={1}>{job.company}</Text>}
        </View>
      </View>

      {/* Meta */}
      <View style={styles.meta}>
        <View style={styles.metaRow}>
          <MapPin size={12} color={Colors.muted} />
          <Text style={styles.metaText}>{getCountryLabel(job.country)}</Text>
        </View>
        {job.jobType && (
          <View style={styles.metaRow}>
            <Clock size={12} color={Colors.muted} />
            <Text style={styles.metaText}>{JOBTYPE_LABELS[job.jobType]}</Text>
          </View>
        )}
        {job.slots && (
          <View style={styles.metaRow}>
            <Users size={12} color={Colors.muted} />
            <Text style={styles.metaText}>{job.slots} chỉ tiêu</Text>
          </View>
        )}
      </View>

      {/* Footer: salary + time */}
      <View style={styles.footer}>
        <Text style={styles.salary}>
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
        </Text>
        <Text style={styles.time}>{timeAgo(job.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 10,
  },
  compact: { padding: 12 },

  header: { flexDirection: 'row', gap: 12 },
  imageWrap: { flexShrink: 0 },
  image: { width: 56, height: 56, borderRadius: 12 },
  imagePlaceholder: { backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  imageEmoji: { fontSize: 24 },
  titleBlock: { flex: 1, gap: 4 },
  badges: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  title: { color: Colors.text, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  company: { color: Colors.muted, fontSize: 12 },

  meta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: Colors.muted, fontSize: 12 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salary: { color: Colors.yellow, fontSize: 13, fontWeight: '600', flex: 1 },
  time: { color: Colors.muted, fontSize: 11 },
})
