import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  User, Mail, Phone, MapPin, Building2, Globe,
  ChevronRight, LogOut, Pencil, Briefcase,
} from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'
import { Badge } from '@/components/ui/Badge'

const ROLE_LABELS = { user: 'Người tìm việc', employer: 'Nhà tuyển dụng', admin: 'Admin' }
const ROLE_COLORS = { user: Colors.blue, employer: Colors.yellow, admin: Colors.orange }

export default function ProfileScreen() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ])
  }

  if (!user) return null

  const isEmployer = user.role === 'employer'

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{user.fullName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={styles.name}>{user.fullName}</Text>
            <Badge
              label={ROLE_LABELS[user.role]}
              color={ROLE_COLORS[user.role]}
              size="sm"
            />
          </View>
          <TouchableOpacity onPress={() => router.push('/profile/edit')} style={styles.editBtn}>
            <Pencil size={16} color={Colors.muted} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          {[
            { icon: <Mail size={15} color={Colors.muted} />, label: 'Email', value: user.email },
            user.phone && { icon: <Phone size={15} color={Colors.muted} />, label: 'Điện thoại', value: user.phone },
            user.address && { icon: <MapPin size={15} color={Colors.muted} />, label: 'Địa chỉ', value: user.address },
          ].filter(Boolean).map((item: any, i) => (
            <View key={i} style={styles.infoRow}>
              <View style={styles.infoIcon}>{item.icon}</View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Employer info */}
        {isEmployer && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin công ty</Text>
            {[
              user.companyName && { icon: <Building2 size={15} color={Colors.muted} />, label: 'Công ty', value: user.companyName },
              user.website && { icon: <Globe size={15} color={Colors.muted} />, label: 'Website', value: user.website },
            ].filter(Boolean).map((item: any, i) => (
              <View key={i} style={styles.infoRow}>
                <View style={styles.infoIcon}>{item.icon}</View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                  <Text style={styles.infoValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Quick links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nhanh</Text>

          {isEmployer && (
            <TouchableOpacity onPress={() => router.push('/employer')} style={styles.menuItem}>
              <Briefcase size={18} color={Colors.yellow} />
              <Text style={styles.menuText}>Quản lý tin đăng</Text>
              <ChevronRight size={16} color={Colors.muted} style={styles.menuArrow} />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => router.push('/profile/edit')} style={styles.menuItem}>
            <User size={18} color={Colors.blue} />
            <Text style={styles.menuText}>Chỉnh sửa hồ sơ</Text>
            <ChevronRight size={16} color={Colors.muted} style={styles.menuArrow} />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={[styles.menuItem, styles.menuItemDanger]}>
            <LogOut size={18} color={Colors.red} />
            <Text style={[styles.menuText, { color: Colors.red }]}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.dark },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatarWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: `${Colors.yellow}20`,
    borderWidth: 2, borderColor: `${Colors.yellow}40`,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: Colors.yellow, fontSize: 24, fontWeight: '700' },
  nameBlock:  { flex: 1, gap: 6 },
  name:       { color: Colors.text, fontSize: 18, fontWeight: '700' },
  editBtn:    { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },

  section:      { margin: 16, marginBottom: 0 },
  sectionTitle: { color: Colors.muted, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 10 },

  infoRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  infoIcon:    { marginTop: 2 },
  infoContent: { flex: 1 },
  infoLabel:   { color: Colors.muted, fontSize: 12 },
  infoValue:   { color: Colors.text, fontSize: 14, marginTop: 2 },

  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  menuItemDanger: { borderBottomWidth: 0 },
  menuText:  { flex: 1, color: Colors.text, fontSize: 15 },
  menuArrow: { marginLeft: 'auto' },
})
