'use client';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import StatsCard from '@/components/analytics/StatsCard';
import RevenueChart from '@/components/analytics/RevenueChart';
import MembershipChart from '@/components/analytics/MembershipChart';
import { AnalyticsSummary } from '@/types';

export default function DashboardPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [revenueData, setRevenueData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  
  const fetchAnalytics = async () => {
    try {
      const [sumRes, revRes, memRes] = await Promise.all([
        api.get('/analytics/summary'),
        api.get('/analytics/revenue'),
        api.get('/analytics/membership-growth')
      ]);
      setSummary(sumRes.data);
      setRevenueData(revRes.data);
      setMembershipData(memRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 60000); // 60s auto-refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Top row - 5 stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatsCard title="Total Members" value={summary?.totalMembers || 0} type="total" />
        <StatsCard title="Active Members" value={summary?.activeMembers || 0} type="active" />
        <StatsCard title="Expiring This Week" value={summary?.expiringThisWeek || 0} type="expiring" />
        <StatsCard title="Monthly Revenue" value={summary?.monthlyRevenue || 0} type="revenue" />
        <StatsCard title="Total Trainers" value={summary?.trainerCount || 0} type="trainers" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RevenueChart data={revenueData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MembershipChart data={membershipData} />
        </div>
        <div className="glass-panel p-6 flex items-center justify-center text-textMuted">
          Pie Chart Placeholder
        </div>
      </div>
    </div>
  );
}
