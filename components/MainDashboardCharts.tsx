"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export default function MainDashboardCharts({ branches }: { branches: any[] }) {
  
  const data = branches.map(b => ({
    name: b.branch_name,
    Accounts:b._count.accounts,
    Loans:b._count.loans,
    Investments:b._count.investments,
    Requests:b._count.documentRequest,
  }));

  

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={2} margin={{top:20,right:30,left:20,bottom:60}}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            interval={0}
            height={100}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: '#f8fafc' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="top" height={36} />

          <Bar dataKey="Accounts" fill="#3b82f6" radius={[2,2,0,0]} barSize={15}/>
          <Bar dataKey="Loans" fill="#8b5Cf6" radius={[2,2,0,0]} barSize={15}/>
          <Bar dataKey="Investments" fill="#f59e0b" radius={[2,2,0,0]} barSize={15}/>
          
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}