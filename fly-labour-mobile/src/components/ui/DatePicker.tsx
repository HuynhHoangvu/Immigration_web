import { useState } from 'react'
import {
  View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Platform,
} from 'react-native'
import { Colors } from '@/constants/colors'

interface Props {
  label?: string
  value: string          // 'YYYY-MM-DD' hoặc ''
  onChange: (v: string) => void
  placeholder?: string
}

const MONTHS = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                 'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']

const currentYear = new Date().getFullYear()
const YEARS  = Array.from({ length: 80 }, (_, i) => currentYear - i)        // 1945 → hiện tại
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1)

function parse(v: string) {
  const [y, m, d] = (v || '').split('-').map(Number)
  return { year: y || currentYear - 25, month: m || 1, day: d || 1 }
}

function fmt(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

function display(v: string) {
  if (!v) return ''
  const { year, month, day } = parse(v)
  return `${String(day).padStart(2,'0')}/${String(month).padStart(2,'0')}/${year}`
}

// Web: dùng <input type="date"> native
function WebDateInput({ label, value, onChange, placeholder }: Props) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.webInputWrap}>
        {/* @ts-ignore — web only */}
        <input
          type="date"
          value={value}
          onChange={(e: any) => onChange(e.target.value)}
          style={{
            width: '100%', backgroundColor: 'transparent', border: 'none',
            color: value ? Colors.text : Colors.muted, fontSize: 14,
            outline: 'none', cursor: 'pointer',
          }}
          placeholder={placeholder}
        />
      </View>
    </View>
  )
}

export function DatePicker({ label, value, onChange, placeholder = 'Chọn ngày sinh' }: Props) {
  if (Platform.OS === 'web') {
    return <WebDateInput label={label} value={value} onChange={onChange} placeholder={placeholder} />
  }

  const [open, setOpen] = useState(false)
  const { year, month, day } = parse(value)
  const [selYear,  setSelYear]  = useState(year)
  const [selMonth, setSelMonth] = useState(month)
  const [selDay,   setSelDay]   = useState(day)

  const confirm = () => {
    onChange(fmt(selYear, selMonth, selDay))
    setOpen(false)
  }

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity style={styles.trigger} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.triggerText, !value && styles.placeholder]}>
          {value ? display(value) : placeholder}
        </Text>
        <Text style={styles.icon}>📅</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.cancel}>Hủy</Text>
              </TouchableOpacity>
              <Text style={styles.sheetTitle}>Chọn ngày sinh</Text>
              <TouchableOpacity onPress={confirm}>
                <Text style={styles.done}>Xong</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.wheels}>
              {/* Day */}
              <ScrollView style={styles.wheel} showsVerticalScrollIndicator={false}>
                {DAYS.map(d => (
                  <TouchableOpacity key={d} onPress={() => setSelDay(d)} style={[styles.wheelItem, d === selDay && styles.wheelItemActive]}>
                    <Text style={[styles.wheelText, d === selDay && styles.wheelTextActive]}>{String(d).padStart(2,'0')}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Month */}
              <ScrollView style={[styles.wheel, { flex: 2 }]} showsVerticalScrollIndicator={false}>
                {MONTHS.map((m, i) => (
                  <TouchableOpacity key={i} onPress={() => setSelMonth(i + 1)} style={[styles.wheelItem, (i+1) === selMonth && styles.wheelItemActive]}>
                    <Text style={[styles.wheelText, (i+1) === selMonth && styles.wheelTextActive]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Year */}
              <ScrollView style={styles.wheel} showsVerticalScrollIndicator={false}>
                {YEARS.map(y => (
                  <TouchableOpacity key={y} onPress={() => setSelYear(y)} style={[styles.wheelItem, y === selYear && styles.wheelItemActive]}>
                    <Text style={[styles.wheelText, y === selYear && styles.wheelTextActive]}>{y}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper:  { gap: 6 },
  label:    { color: Colors.text, fontSize: 13, fontWeight: '500' },

  trigger:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  triggerText: { color: Colors.text, fontSize: 14 },
  placeholder: { color: Colors.muted },
  icon:     { fontSize: 16 },

  webInputWrap: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },

  overlay:  { flex: 1, backgroundColor: '#00000080', justifyContent: 'flex-end' },
  sheet:    { backgroundColor: Colors.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
  sheetTitle:  { color: Colors.text, fontSize: 16, fontWeight: '600' },
  cancel:   { color: Colors.muted, fontSize: 15 },
  done:     { color: Colors.yellow, fontSize: 15, fontWeight: '600' },

  wheels:   { flexDirection: 'row', height: 200, paddingHorizontal: 16, gap: 8 },
  wheel:    { flex: 1 },
  wheelItem:       { paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  wheelItemActive: { backgroundColor: `${Colors.yellow}20` },
  wheelText:       { color: Colors.muted, fontSize: 14 },
  wheelTextActive: { color: Colors.yellow, fontWeight: '700', fontSize: 15 },
})
