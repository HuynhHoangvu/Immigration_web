import '../global.css'
import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import Toast from 'react-native-toast-message'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { Colors } from '@/constants/colors'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000 } },
})

function AuthGuard() {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    hydrate()
  }, [])

  useEffect(() => {
    if (isLoading) return
    SplashScreen.hideAsync()

    const inAuth = segments[0] === '(auth)'
    if (!isAuthenticated && !inAuth) {
      router.replace('/(auth)/login')
    } else if (isAuthenticated && inAuth) {
      router.replace('/(tabs)')
    }
  }, [isAuthenticated, isLoading, segments])

  if (isLoading) return <LoadingScreen />
  return null
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" backgroundColor={Colors.dark} />
      <AuthGuard />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.dark },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="jobs/[id]" options={{ headerShown: true, headerTitle: 'Chi tiết việc làm', headerStyle: { backgroundColor: Colors.card }, headerTintColor: Colors.text }} />
        <Stack.Screen name="employer" />
        <Stack.Screen name="profile/edit" options={{ headerShown: true, headerTitle: 'Chỉnh sửa hồ sơ', headerStyle: { backgroundColor: Colors.card }, headerTintColor: Colors.text }} />
      </Stack>
      <Toast />
    </QueryClientProvider>
  )
}
