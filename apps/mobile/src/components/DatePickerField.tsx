import { useMemo, useState } from 'react'
import { Modal, Pressable, Text, View } from 'react-native'
import { formatDate } from '@betterbudget/shared'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toDate(yyyyMmDd: string): Date {
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function buildCells(year: number, month: number): (number | null)[] {
  const firstDow = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = Array(firstDow).fill(null)
  for (let d = 1; d <= total; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

interface Props {
  label: string
  value: string
  onChange: (date: string) => void
  minDate?: Date
  maxDate?: Date
}

export default function DatePickerField({ label, value, onChange, minDate, maxDate }: Props) {
  const [show, setShow] = useState(false)
  const parsed = value ? toDate(value) : new Date()
  const [viewYear, setViewYear] = useState(parsed.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed.getMonth())

  const cells = useMemo(() => buildCells(viewYear, viewMonth), [viewYear, viewMonth])

  function open() {
    const d = value ? toDate(value) : new Date()
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
    setShow(true)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function canPrev() {
    if (!minDate) return true
    return new Date(viewYear, viewMonth, 1) > new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  }

  function canNext() {
    if (!maxDate) return true
    return new Date(viewYear, viewMonth, 1) < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    if (minDate && d < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())) return true
    if (maxDate && d > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())) return true
    return false
  }

  function isSelected(day: number) {
    return !!value && parsed.getFullYear() === viewYear && parsed.getMonth() === viewMonth && parsed.getDate() === day
  }

  function selectDay(day: number) {
    onChange(toDateString(new Date(viewYear, viewMonth, day)))
    setShow(false)
  }

  const rows = useMemo(() => {
    const out: (number | null)[][] = []
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7))
    return out
  }, [cells])

  return (
    <View>
      <Text className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1">{label}</Text>
      <Pressable onPress={open} className="px-3 py-2 border border-stone-200 rounded bg-white">
        <Text className="text-sm text-stone-800">{value ? formatDate(value) : '—'}</Text>
      </Pressable>

      <Modal visible={show} transparent animationType="slide" onRequestClose={() => setShow(false)}>
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-2xl px-4 pt-4 pb-8">

            {/* Month navigation */}
            <View className="flex-row items-center justify-between mb-4">
              <Pressable onPress={prevMonth} disabled={!canPrev()} className="p-2 w-9 items-center">
                <Text className={`text-lg font-light ${canPrev() ? 'text-stone-700' : 'text-stone-300'}`}>‹</Text>
              </Pressable>
              <Text className="text-sm font-semibold text-stone-800">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </Text>
              <Pressable onPress={nextMonth} disabled={!canNext()} className="p-2 w-9 items-center">
                <Text className={`text-lg font-light ${canNext() ? 'text-stone-700' : 'text-stone-300'}`}>›</Text>
              </Pressable>
            </View>

            {/* Day-of-week header */}
            <View className="flex-row mb-1">
              {DOW.map((d, i) => (
                <View key={i} className="flex-1 items-center py-1">
                  <Text className="text-xs font-medium text-stone-400">{d}</Text>
                </View>
              ))}
            </View>

            {/* Calendar grid */}
            {rows.map((row, ri) => (
              <View key={ri} className="flex-row mb-0.5">
                {row.map((day, ci) => {
                  const disabled = day !== null && isDisabled(day)
                  const selected = day !== null && isSelected(day)
                  return (
                    <Pressable
                      key={ci}
                      onPress={() => day !== null && !disabled && selectDay(day)}
                      disabled={day === null || disabled}
                      className={`flex-1 items-center py-1.5 rounded-full mx-0.5 ${selected ? 'bg-stone-700' : ''}`}
                    >
                      <Text className={`text-sm ${
                        day === null ? '' :
                        selected ? 'text-white font-medium' :
                        disabled ? 'text-stone-300' :
                        'text-stone-800'
                      }`}>
                        {day ?? ''}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            ))}

            <Pressable onPress={() => setShow(false)} className="mt-3 items-center py-2">
              <Text className="text-sm text-stone-500">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  )
}
