import { Tabs } from 'expo-router'
import { Home, Search, FileText, User } from 'lucide-react-native'
import { Colors } from '@/constants/colors'
import { useAuthStore } from '@/store/authStore'

export default function TabsLayout() {
  const user = useAuthStore(s => s.user)
  const isEmployer = user?.role === 'employer'

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: Colors.yellow,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Trang chủ', tabBarIcon: ({ color }) => <Home size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="jobs"
        options={{ title: 'Việc làm', tabBarIcon: ({ color }) => <Search size={22} color={color} /> }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: isEmployer ? 'Ứng viên' : 'Đơn của tôi',
          tabBarIcon: ({ color }) => <FileText size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Hồ sơ', tabBarIcon: ({ color }) => <User size={22} color={color} /> }}
      />
    </Tabs>
  )
}
