import { Stack } from 'expo-router'
import { Colors } from '@/constants/colors'

export default function EmployerLayout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: Colors.card }, headerTintColor: Colors.text, contentStyle: { backgroundColor: Colors.dark } }}>
      <Stack.Screen name="index" options={{ headerTitle: 'Quản lý tin đăng' }} />
    </Stack>
  )
}
