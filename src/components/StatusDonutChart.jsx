import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLORS = {
  created: '#C08A28',
  in_transit: '#C08A28',
  delivered: '#3F8F7A',
  closed: '#6E7280',
  anomaly: '#C1442E',
}

const STATUS_LABELS = {
  created: 'Créé',
  in_transit: 'En transit',
  delivered: 'Livré',
  closed: 'Clôturé',
  anomaly: 'Anomalie',
}

export default function StatusDonutChart({ data }) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([status, value]) => ({
      name: STATUS_LABELS[status] ?? status,
      value,
      color: STATUS_COLORS[status] ?? '#6E7280',
    }))

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="font-body text-sm text-text-secondary">
          Aucun lot à afficher pour le moment.
        </p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            fontFamily: 'IBM Plex Sans',
            fontSize: '13px',
            border: '1px solid #D8D8D0',
            borderRadius: '4px',
          }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          formatter={(value) => (
            <span style={{ fontFamily: 'IBM Plex Sans', fontSize: '13px', color: '#1D2430' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}