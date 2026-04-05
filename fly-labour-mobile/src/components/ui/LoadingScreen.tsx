import { View, ActivityIndicator, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

export function LoadingScreen({ message = 'Đang tải...' }: { message?: string }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.yellow} />
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 999,
  },
  text: { color: Colors.muted, fontSize: 14 },
})
