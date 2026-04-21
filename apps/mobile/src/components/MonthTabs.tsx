import { Pressable, ScrollView, Text, View } from 'react-native'
import { MONTHS } from '@betterbudget/shared'

interface Props {
  year: number
  activeMonth: string // YYYY-MM
  onMonthChange: (month: string) => void
  onYearChange: (year: number) => void
}

export default function MonthTabs({ year, activeMonth, onMonthChange, onYearChange }: Props) {
  return (
    <View>
      {/* Year row */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-stone-50 border border-stone-200 rounded-t-lg">
        <Pressable onPress={() => onYearChange(year - 1)} className="px-3 py-1">
          <Text className="text-stone-500 text-base">‹</Text>
        </Pressable>
        <Text className="text-sm font-medium text-stone-700">{year}</Text>
        <Pressable onPress={() => onYearChange(year + 1)} className="px-3 py-1">
          <Text className="text-stone-500 text-base">›</Text>
        </Pressable>
      </View>

      {/* Month tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-x border-stone-200 bg-stone-50"
      >
        <View className="flex-row">
          {MONTHS.map((label, i) => {
            const month = `${year}-${String(i + 1).padStart(2, '0')}`
            const isActive = month === activeMonth
            return (
              <Pressable
                key={month}
                onPress={() => onMonthChange(month)}
                className={`px-3 py-2 border-b-2 ${isActive ? 'border-stone-800' : 'border-transparent'}`}
              >
                <Text className={`text-xs ${isActive ? 'font-medium text-stone-800' : 'text-stone-500'}`}>
                  {label}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}
