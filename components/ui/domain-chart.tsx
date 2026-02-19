 "use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Rectangle
} from "recharts"

interface DomainChartProps {
  domains: {
    web: number
    ml: number
    cp: number
    appDev: number
    cyber: number
  }
}

// Fallback colors in case your CSS variables aren't rendering properly
const COLORS = [
  "hsl(var(--chart-1, 220 70% 50%))",
  "hsl(var(--chart-2, 160 60% 45%))",
  "hsl(var(--chart-3, 30 80% 55%))",
  "hsl(var(--chart-4, 280 65% 60%))",
  "hsl(var(--chart-5, 340 75% 55%))",
]

// Custom Tooltip for a cleaner, modern look
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-background/95 p-3 shadow-md backdrop-blur-sm dark:bg-card">
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {payload[0].payload.name}
        </p>
        <p className="text-lg font-bold text-foreground">
          {payload[0].value}
          <span className="text-sm font-normal text-muted-foreground">%</span>
        </p>
      </div>
    )
  }
  return null
}

export function DomainChart({ domains }: DomainChartProps) {
  const data = [
    { name: "Web Dev", value: domains.web },
    { name: "AI / ML", value: domains.ml },
    { name: "Comp. Programming", value: domains.cp },
    { name: "App Dev", value: domains.appDev },
    { name: "Cybersecurity", value: domains.cyber },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      {/* Increased bottom margin to prevent text clipping */}
      <BarChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 60 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border))"
          vertical={false} // Hiding vertical lines often looks cleaner
          opacity={0.4}
        />
        <XAxis
          dataKey="name"
          interval={0}
          angle={-40}
          textAnchor="end"
          dx={-5} // Shift text slightly left
          dy={15} // Push text down away from the bars
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false} // Removes the solid baseline for a floating look
        />
        <YAxis
          domain={[0, 100]}
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        
        <Tooltip
          content={<CustomTooltip />}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }} // Soft background highlight on hover
        />
        
        <Bar 
          dataKey="value" 
          radius={[6, 6, 0, 0]}
          animationDuration={1500} // Smooth entry animation
          // This creates the smooth hover effect on the specific bar
          activeBar={<Rectangle fillOpacity={0.8} stroke="hsl(var(--foreground))" strokeWidth={1} strokeDasharray="4 4" />}
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              className="transition-all duration-300 ease-in-out" 
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}