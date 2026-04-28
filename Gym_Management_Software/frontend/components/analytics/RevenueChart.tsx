'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueChart({ data }: { data: any[] }) {
  return (
    <div className="glass-panel p-6 w-full h-[400px]">
      <h3 className="text-lg font-semibold mb-6">Revenue Growth</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(v) => `$${v}`} />
          <Tooltip 
            cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '3 3' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{r:4, fill:'#2563eb', strokeWidth:0}} activeDot={{r: 8}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
