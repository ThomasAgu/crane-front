'use client'

import { FC } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts'

const fmt = (n: number, d = 1) => (isNaN(n) ? '0' : n.toFixed(d))

export const MainChart: FC<{
  seriesByContainer: Record<
    string,
    { name: string; data: { i: number; v: number }[] }
  >
  activeKey: string | null
  metricLabel: string
  color: string
}> = ({ seriesByContainer, activeKey, metricLabel, color }) => {
  const keys = Object.keys(seriesByContainer)
  const length = Math.max(...keys.map(k => seriesByContainer[k].data.length), 0)

  const aggregated = Array.from({ length }).map((_, i) => {
    const item: any = { i }
    keys.forEach(k => {
      item[k] = seriesByContainer[k].data[i]
        ? Number(seriesByContainer[k].data[i].v)
        : 0
    })
    item.total = keys.reduce(
      (sum, k) => sum + (seriesByContainer[k].data[i]?.v ?? 0),
      0
    )
    return item
  })

  return (
    <div className="w-full bg-[rgba(255,255,255,0.02)] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium text-gray-200">{metricLabel}</div>
        <div className="text-xs text-gray-400">Last {length} points</div>
      </div>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={aggregated}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="i"
              tick={{ fill: '#9aa0ad', fontSize: 11 }}
              stroke="rgba(255,255,255,0.05)"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#9aa0ad', fontSize: 11 }}
              stroke="rgba(255,255,255,0.05)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#26272f',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
              }}
              labelFormatter={(i: number) => `Point ${i}`}
              formatter={(v: number) => [`${fmt(v, 2)}`, 'Total']}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive
              animationDuration={600}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
