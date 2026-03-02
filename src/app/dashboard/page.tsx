'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  OverviewIcon,
  ProfileIcon,
  CoopIcon,
  EggIcon,
  HealthIcon,
  FeedIcon,
  MedicationIcon,
  FinanceIcon,
  SearchIcon,
  ExportIcon,
  AddIcon,
  CloseIcon,
  EditIcon,
  CalendarIcon,
  LocationIcon,
  LogoutIcon,
  ChartIcon,
  TrendUpIcon,
  AlertIcon,
  CheckIcon,
  CapacityIcon,
} from '@/components/Icons';

interface Farm {
  id: string;
  name: string;
  location: string;
  coops?: Coop[];
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface Coop {
  id: string;
  name: string;
  capacity: number;
}

interface EggRecord {
  id: string;
  date: string;
  quantity: number;
  grade?: string;
  notes?: string;
  coop: Coop;
}

interface HealthRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  quantity: number;
  coop: Coop;
}

interface FeedRecord {
  id: string;
  date: string;
  feedType: string;
  quantity: number;
  cost?: number;
  supplier?: string;
  coop: Coop;
}

interface Medication {
  id: string;
  date: string;
  name: string;
  type: string;
  dosage?: string;
  notes?: string;
  cost?: number;
}

interface FinancialRecord {
  id: string;
  date: string;
  type: string;
  category: string;
  amount: number;
  description?: string;
}

// Utility functions
function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const cell = row[header];
      if (typeof cell === 'object' && cell !== null) {
        return JSON.stringify(cell).replace(/,/g, ';');
      }
      return `"${String(cell || '').replace(/"/g, '""')}"`;
    }).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token || !userStr) {
      router.push('/');
      return;
    }

    setUser(JSON.parse(userStr));
    fetchFarm(token);
  }, [router]);

  const fetchFarm = async (token: string) => {
    try {
      const response = await fetch('/api/farm', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFarm(data);
      }
    } catch (error) {
      console.error('Error fetching farm:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-slate-900">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 pb-28 sm:pt-24 sm:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-emerald-500/20 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-emerald-900/95 shadow-2xl backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            {/* Logo and Title */}
            <div className="flex min-w-0 items-center gap-2 sm:gap-4">
              <div className="shrink-0 p-2.5 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 rounded-xl shadow-2xl sm:p-3.5 hover:shadow-emerald-500/50 transition-all duration-300">
                <CoopIcon className="text-white" size={24} />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent sm:text-3xl font-extrabold">
                  Poultry Farm Manager
                </h1>
                {farm && (
                  <p className="truncate text-xs text-emerald-200 sm:text-sm font-semibold">
                    🚜 {farm.name}
                  </p>
                )}
              </div>
            </div>
            
            {/* User Welcome Section */}
            <div className="text-right">
              <p className="text-xs text-emerald-300/70 sm:text-sm uppercase tracking-wide font-medium">Welcome back</p>
              <p className="text-sm font-bold text-emerald-100 sm:text-base truncate">{user?.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        {!farm ? (
          <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 p-6 sm:p-10 rounded-2xl shadow-2xl">
            <p className="text-slate-900 text-center text-lg font-semibold">Loading farm information...</p>
          </div>
        ) : (
          <div>
            {/* Tab Content */}
            <div className="rounded-2xl border border-slate-200/50 bg-gradient-to-br from-white via-slate-50 to-emerald-50/30 p-4 shadow-2xl sm:p-8 sm:rounded-3xl lg:p-10 backdrop-blur-sm">
              {activeTab === 'overview' && <OverviewTab farm={farm} />}
              {activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
              {activeTab === 'coops' && <CoopsTab farm={farm} />}
              {activeTab === 'egg-production' && <EggProductionTab farm={farm} />}
              {activeTab === 'health' && <HealthTab farm={farm} />}
              {activeTab === 'feed' && <FeedTab farm={farm} />}
              {activeTab === 'medications' && <MedicationsTab farm={farm} />}
              {activeTab === 'financials' && <FinancialsTab farm={farm} />}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 border border-emerald-400/40 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-emerald-900/95 backdrop-blur-2xl shadow-2xl shadow-emerald-900/80 rounded-3xl sm:hidden hover:shadow-emerald-900/100 transition-all duration-300">
        <div className="flex max-w-md justify-around gap-2 px-4 py-3">
          {[
            { id: 'overview', label: 'Overview', Icon: OverviewIcon },
            { id: 'profile', label: 'Profile', Icon: ProfileIcon },
            { id: 'coops', label: 'Coops', Icon: CoopIcon },
            { id: 'egg-production', label: 'Eggs', Icon: EggIcon },
            { id: 'health', label: 'Health', Icon: HealthIcon },
            { id: 'feed', label: 'Feed', Icon: FeedIcon },
            { id: 'medications', label: 'Meds', Icon: MedicationIcon },
            { id: 'financials', label: 'Finance', Icon: FinanceIcon },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-1 px-2.5 py-2.5 text-xs font-bold rounded-2xl transition-all duration-300 hover:scale-110 ${
                activeTab === id
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/60 scale-110'
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-900/50'
              }`}
              title={label}
            >
              <Icon size={20} className={activeTab === id ? 'text-white' : 'text-emerald-300/70'} />
              <span className="text-[9px] font-bold">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Top Navigation */}
      <div className="hidden sm:flex fixed top-6 left-1/2 -translate-x-1/2 z-40 border border-emerald-400/40 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-emerald-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-emerald-900/80 hover:shadow-emerald-900/100 transition-all duration-300">
        <div className="flex gap-2 px-4 py-3">
          {[
            { id: 'overview', label: 'Overview', Icon: OverviewIcon },
            { id: 'profile', label: 'Profile', Icon: ProfileIcon },
            { id: 'coops', label: 'Coops', Icon: CoopIcon },
            { id: 'egg-production', label: 'Egg Production', Icon: EggIcon },
            { id: 'health', label: 'Health Records', Icon: HealthIcon },
            { id: 'feed', label: 'Feed Management', Icon: FeedIcon },
            { id: 'medications', label: 'Medications', Icon: MedicationIcon },
            { id: 'financials', label: 'Financial Records', Icon: FinanceIcon },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold whitespace-nowrap rounded-xl transition-all duration-300 hover:scale-105 ${
                activeTab === id
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/60'
                  : 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-900/50'
              }`}
            >
              <Icon size={20} className={activeTab === id ? 'text-white' : 'text-emerald-300/70'} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add padding for floating navs */}
      <div className="h-0" />
    </div>
  );
}

// Simple tab components
function ProfileTab({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '' });

  useEffect(() => {
    fetchFarm();
  }, []);

  const fetchFarm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setFarm(data);
        setFormData({ name: data.name, location: data.location });
      }
    } catch (error) {
      console.error('Error fetching farm:', error);
    }
  };

  const handleUpdateFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setIsEditing(false);
        fetchFarm();
        window.location.reload(); // Refresh to update header
      }
    } catch (error) {
      console.error('Error updating farm:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-slate-900 text-lg font-semibold">Loading user information...</p>;
  
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Profile & Farm Settings</h2>
      
      {/* User Information */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl border border-emerald-200/50 shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-all duration-300 hover:border-emerald-300/70">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg">
            <ProfileIcon className="text-white" size={24} />
          </div>
          <h3 className="font-bold text-xl text-slate-900">User Information</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-emerald-100/50">
            <label className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wide">Full Name</label>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{user.name}</p>
          </div>
          <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-emerald-100/50">
            <label className="text-xs sm:text-sm font-bold text-emerald-700 uppercase tracking-wide">Email Address</label>
            <p className="text-lg sm:text-xl font-bold text-slate-900 break-all mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Farm Information */}
      {farm && (
        <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 rounded-2xl border border-blue-200/50 shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 hover:shadow-xl transition-all duration-300 hover:border-blue-300/70">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl shadow-lg">
                <CoopIcon className="text-white" size={24} />
              </div>
              <h3 className="font-bold text-xl text-slate-900">Farm Details</h3>
            </div>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  setFormData({ name: farm.name, location: farm.location });
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
            >
              {isEditing ? 'Cancel' : '✎ Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateFarm} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                  🚜 Farm Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-semibold background transition-all duration-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                  📍 Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-semibold transition-all duration-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 uppercase tracking-wide"
              >
                {loading ? 'Saving...' : '✓ Save Changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100/50">
                <label className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wide">🚜 Farm Name</label>
                <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{farm.name}</p>
              </div>
              <div className="bg-white/60 backdrop-blur rounded-lg p-4 border border-blue-100/50">
                <label className="text-xs sm:text-sm font-bold text-blue-700 uppercase tracking-wide">📍 Location</label>
                <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{farm.location}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 shadow-lg p-6 mb-6 sm:mb-8">
        <div className="flex gap-3">
          <div className="p-2 bg-amber-400 rounded-lg h-fit">
            <AlertIcon className="text-white" size={20} />
          </div>
          <div>
            <p className="text-sm sm:text-base text-amber-900 font-semibold">
              <strong>Security Note:</strong> This application is designed for single-user farm management. Your login provides complete access to all farm records. Keep your credentials secure.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-red-500 via-red-600 to-rose-600 hover:from-red-600 hover:via-red-700 hover:to-rose-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-200 uppercase tracking-wide text-lg"
        >
          <LogoutIcon size={22} />
          <span>Logout from Farm</span>
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ farm }: { farm: Farm }) {
  const [analytics, setAnalytics] = useState({
    totalCoops: 0,
    totalCapacity: 0,
    todayEggs: 0,
    weekEggs: 0,
    monthEggs: 0,
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    healthIncidents: 0,
    recentRecords: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [coopsRes, eggsRes, healthRes, financialsRes] = await Promise.all([
        fetch('/api/farm/coops', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/farm/egg-production', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/farm/health-records', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/farm/financial-records', { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const coops = await coopsRes.json();
      const eggs = await eggsRes.json();
      const health = await healthRes.json();
      const financials = await financialsRes.json();

      // Calculate statistics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      const todayEggs = eggs.filter((e: any) => new Date(e.date) >= today).reduce((sum: number, e: any) => sum + e.quantity, 0);
      const weekEggs = eggs.filter((e: any) => new Date(e.date) >= weekAgo).reduce((sum: number, e: any) => sum + e.quantity, 0);
      const monthEggs = eggs.filter((e: any) => new Date(e.date) >= monthAgo).reduce((sum: number, e: any) => sum + e.quantity, 0);

      const totalIncome = financials.filter((f: any) => f.type === 'income').reduce((sum: number, f: any) => sum + f.amount, 0);
      const totalExpenses = financials.filter((f: any) => f.type === 'expense').reduce((sum: number, f: any) => sum + f.amount, 0);

      const recentHealthIncidents = health.filter((h: any) => new Date(h.date) >= monthAgo);

      setAnalytics({
        totalCoops: coops.length,
        totalCapacity: coops.reduce((sum: number, c: any) => sum + c.capacity, 0),
        todayEggs,
        weekEggs,
        monthEggs,
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        healthIncidents: recentHealthIncidents.length,
        recentRecords: [...eggs, ...health, ...financials]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5),
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-black">Loading analytics...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <ChartIcon size={32} className="text-black" />
        <h2 className="text-3xl font-bold text-black">Farm Analytics Dashboard</h2>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Active Coops Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <CoopIcon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Active Coops</p>
            <p className="text-4xl font-bold text-white mb-2">{analytics.totalCoops}</p>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <CapacityIcon size={16} />
              <span>Capacity: {analytics.totalCapacity} birds</span>
            </div>
          </div>
        </div>

        {/* Today's Eggs Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <EggIcon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Today's Production</p>
            <p className="text-4xl font-bold text-white mb-2">{analytics.todayEggs}</p>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <span>This week: {analytics.weekEggs} eggs</span>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <FinanceIcon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Net Profit</p>
            <p className="text-4xl font-bold text-white mb-2">${analytics.netProfit.toFixed(2)}</p>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <span>Income: ${analytics.totalIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Health Alerts Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <HealthIcon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-white/80 text-sm font-medium mb-1">Health Incidents</p>
            <p className="text-4xl font-bold text-white mb-2">{analytics.healthIncidents}</p>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <AlertIcon size={16} />
              <span>Last 30 days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Egg Production Trend */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 rounded-xl">
              <TrendUpIcon size={24} className="text-amber-600" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Egg Production Trend</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-900 font-medium">Today</span>
                <span className="font-bold text-slate-900">{analytics.todayEggs} eggs</span>
              </div>
              <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
                  style={{ width: `${Math.min((analytics.todayEggs / Math.max(analytics.weekEggs, 1)) * 100, 100)}%` }}
                >
                  <span className="text-white text-xs font-bold">{analytics.todayEggs > 0 ? Math.round((analytics.todayEggs / Math.max(analytics.weekEggs, 1)) * 100) + '%' : ''}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-900 font-medium">This Week</span>
                <span className="font-bold text-slate-900">{analytics.weekEggs} eggs</span>
              </div>
              <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-amber-600 h-full rounded-full transition-all duration-500 flex items-center justify-end px-2"
                  style={{ width: `${Math.min((analytics.weekEggs / Math.max(analytics.monthEggs, 1)) * 100, 100)}%` }}
                >
                  <span className="text-white text-xs font-bold">{analytics.weekEggs > 0 ? Math.round((analytics.weekEggs / Math.max(analytics.monthEggs, 1)) * 100) + '%' : ''}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-900 font-medium">This Month</span>
                <span className="font-bold text-slate-900">{analytics.monthEggs} eggs</span>
              </div>
              <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 to-orange-600 h-full rounded-full w-full transition-all duration-500 flex items-center justify-end px-2">
                  <span className="text-white text-xs font-bold">100%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-medium">Daily Average</span>
              <span className="text-2xl font-bold text-slate-900">{(analytics.monthEggs / 30).toFixed(1)}</span>
            </div>
            <p className="text-sm text-slate-700 mt-1">eggs per day</p>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <FinanceIcon size={24} className="text-emerald-600" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Financial Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-emerald-600">${analytics.totalIncome.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-xl">
                <TrendUpIcon size={24} className="text-emerald-600" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-rose-50 rounded-xl border border-red-200">
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">${analytics.totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <FinanceIcon size={24} className="text-red-600" />
              </div>
            </div>
            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-300 shadow-md">
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Net Profit</p>
                <p className={`text-3xl font-bold ${analytics.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  ${analytics.netProfit.toFixed(2)}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${analytics.netProfit >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                <CheckIcon size={28} className={analytics.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'} />
              </div>
            </div>
          </div>
          {analytics.totalIncome > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 font-medium">Profit Margin</span>
                <span className={`text-2xl font-bold ${analytics.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {((analytics.netProfit / analytics.totalIncome) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Farm Info */}
      <div className="bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-xl">
            <CoopIcon size={24} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-xl text-slate-900">Farm Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-slate-700 mb-2 font-medium">Farm Name</p>
            <p className="font-bold text-lg text-slate-900">{farm.name}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-sm text-slate-700 mb-2 font-medium">
              <LocationIcon size={16} />
              <span>Location</span>
            </div>
            <p className="font-bold text-lg text-slate-900">{farm.location}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <p className="text-sm text-slate-700 mb-2 font-medium">Status</p>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
              <CheckIcon size={16} />
              <span>Active & Operational</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoopsTab({ farm }: { farm: Farm }) {
  const [coops, setCoops] = useState<Coop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', capacity: '' });

  useEffect(() => {
    fetchCoops();
  }, []);

  const fetchCoops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/coops', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCoops(data);
      }
    } catch (error) {
      console.error('Error fetching coops:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/coops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          capacity: parseInt(formData.capacity),
        }),
      });
      if (response.ok) {
        setFormData({ name: '', capacity: '' });
        setShowForm(false);
        fetchCoops();
      }
    } catch (error) {
      console.error('Error creating coop:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Coops / Houses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Coop'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl mb-8 border border-blue-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AddIcon size={24} className="text-blue-600" />
            Add New Coop
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Coop Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter coop name (e.g., Coop A)"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Capacity (birds)</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                placeholder="Enter bird capacity"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {loading ? 'Adding Coop...' : 'Create Coop'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coops.map((coop) => (
          <div key={coop.id} className="group relative bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <CoopIcon size={24} className="text-blue-600" />
            </div>
            <div className="pr-14">
              <h3 className="font-bold text-2xl text-slate-900 mb-3">{coop.name}</h3>
              <div className="flex items-center gap-2 text-slate-900">
                <CapacityIcon size={20} className="text-slate-700" />
                <span className="font-semibold">{coop.capacity}</span>
                <span className="text-sm">birds capacity</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-900 font-medium">Status:</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-semibold">
                    <CheckIcon size={14} />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {coops.length === 0 && (
          <div className="col-span-full text-center py-16 bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl border-2 border-dashed border-slate-300">
            <div className="inline-flex p-4 bg-white rounded-full shadow-lg mb-4">
              <CoopIcon size={48} className="text-slate-700" />
            </div>
            <p className="text-slate-900 text-lg font-medium mb-2">No coops added yet</p>
            <p className="text-slate-700">Click "Add New Coop" button above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EggProductionTab({ farm }: { farm: Farm }) {
  const [records, setRecords] = useState<EggRecord[]>([]);
  const [coops, setCoops] = useState<Coop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'date' | 'quantity'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [formData, setFormData] = useState({
    coopId: '',
    date: new Date().toISOString().split('T')[0],
    quantity: '',
    grade: '',
    notes: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchCoops();
  }, []);

  const fetchCoops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/coops', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCoops(data);
      }
    } catch (error) {
      console.error('Error fetching coops:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/egg-production', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/egg-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coopId: formData.coopId,
          date: formData.date,
          quantity: parseInt(formData.quantity),
          grade: formData.grade || undefined,
          notes: formData.notes || undefined,
        }),
      });
      if (response.ok) {
        setFormData({
          coopId: '',
          date: new Date().toISOString().split('T')[0],
          quantity: '',
          grade: '',
          notes: '',
        });
        setShowForm(false);
        fetchRecords();
      }
    } catch (error) {
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Egg Production Records</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1">Coop</label>
              <select
                value={formData.coopId}
                onChange={(e) => setFormData({ ...formData, coopId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Coop</option>
                {coops.map((coop) => (
                  <option key={coop.id} value={coop.id}>
                    {coop.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Quantity (eggs)</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Grade (optional)</label>
              <select
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Select Grade</option>
                <option value="Large">Large</option>
                <option value="Medium">Medium</option>
                <option value="Small">Small</option>
                <option value="Jumbo">Jumbo</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-1">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Coop</th>
              <th className="border p-2 text-right">Quantity</th>
              <th className="border p-2 text-left">Grade</th>
              <th className="border p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-2">{record.coop.name}</td>
                <td className="border p-2 text-right">{record.quantity}</td>
                <td className="border p-2">{record.grade || '-'}</td>
                <td className="border p-2">{record.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-slate-900 text-center py-8">No egg production records yet. Click "Add Record" to get started.</p>
        )}
      </div>
    </div>
  );
}

function HealthTab({ farm }: { farm: Farm }) {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [coops, setCoops] = useState<Coop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    coopId: '',
    date: new Date().toISOString().split('T')[0],
    type: '',
    description: '',
    quantity: '1',
  });

  useEffect(() => {
    fetchRecords();
    fetchCoops();
  }, []);

  const fetchCoops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/coops', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCoops(data);
      }
    } catch (error) {
      console.error('Error fetching coops:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/health-records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/health-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coopId: formData.coopId,
          date: formData.date,
          type: formData.type,
          description: formData.description,
          quantity: parseInt(formData.quantity),
        }),
      });
      if (response.ok) {
        setFormData({
          coopId: '',
          date: new Date().toISOString().split('T')[0],
          type: '',
          description: '',
          quantity: '1',
        });
        setShowForm(false);
        fetchRecords();
      }
    } catch (error) {
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Health Records</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Coop</label>
              <select
                value={formData.coopId}
                onChange={(e) => setFormData({ ...formData, coopId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Coop</option>
                {coops.map((coop) => (
                  <option key={coop.id} value={coop.id}>
                    {coop.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="mortality">Mortality</option>
                <option value="illness">Illness</option>
                <option value="vaccination">Vaccination</option>
                <option value="treatment">Treatment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Birds Affected</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Coop</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-right">Birds Affected</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-2">{record.coop.name}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    record.type === 'mortality' ? 'bg-red-100 text-red-800' :
                    record.type === 'illness' ? 'bg-orange-100 text-orange-800' :
                    record.type === 'vaccination' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="border p-2 text-right">{record.quantity}</td>
                <td className="border p-2">{record.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-slate-900 text-center py-8">No health records yet. Click "Add Record" to get started.</p>
        )}
      </div>
    </div>
  );
}

function FeedTab({ farm }: { farm: Farm }) {
  const [records, setRecords] = useState<FeedRecord[]>([]);
  const [coops, setCoops] = useState<Coop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    coopId: '',
    date: new Date().toISOString().split('T')[0],
    feedType: '',
    quantity: '',
    cost: '',
    supplier: '',
  });

  useEffect(() => {
    fetchRecords();
    fetchCoops();
  }, []);

  const fetchCoops = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/coops', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCoops(data);
      }
    } catch (error) {
      console.error('Error fetching coops:', error);
    }
  };

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/feed-records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/feed-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coopId: formData.coopId,
          date: formData.date,
          feedType: formData.feedType,
          quantity: parseFloat(formData.quantity),
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
          supplier: formData.supplier || undefined,
        }),
      });
      if (response.ok) {
        setFormData({
          coopId: '',
          date: new Date().toISOString().split('T')[0],
          feedType: '',
          quantity: '',
          cost: '',
          supplier: '',
        });
        setShowForm(false);
        fetchRecords();
      }
    } catch (error) {
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feed Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Coop</label>
              <select
                value={formData.coopId}
                onChange={(e) => setFormData({ ...formData, coopId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Coop</option>
                {coops.map((coop) => (
                  <option key={coop.id} value={coop.id}>
                    {coop.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Feed Type</label>
              <input
                type="text"
                value={formData.feedType}
                onChange={(e) => setFormData({ ...formData, feedType: e.target.value })}
                placeholder="e.g., Layer Pellets, Grains"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Quantity (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Cost (optional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Supplier (optional)</label>
              <input
                type="text"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Supplier name"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Coop</th>
              <th className="border p-2 text-left">Feed Type</th>
              <th className="border p-2 text-right">Quantity (kg)</th>
              <th className="border p-2 text-right">Cost</th>
              <th className="border p-2 text-left">Supplier</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-2">{record.coop.name}</td>
                <td className="border p-2">{record.feedType}</td>
                <td className="border p-2 text-right">{record.quantity}</td>
                <td className="border p-2 text-right">{record.cost ? `$${record.cost.toFixed(2)}` : '-'}</td>
                <td className="border p-2">{record.supplier || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-slate-900 text-center py-8">No feed records yet. Click "Add Record" to get started.</p>
        )}
      </div>
    </div>
  );
}

function MedicationsTab({ farm }: { farm: Farm }) {
  const [records, setRecords] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    name: '',
    type: '',
    dosage: '',
    notes: '',
    cost: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/medications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: formData.date,
          name: formData.name,
          type: formData.type,
          dosage: formData.dosage || undefined,
          notes: formData.notes || undefined,
          cost: formData.cost ? parseFloat(formData.cost) : undefined,
        }),
      });
      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          name: '',
          type: '',
          dosage: '',
          notes: '',
          cost: '',
        });
        setShowForm(false);
        fetchRecords();
      }
    } catch (error) {
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Medications & Vaccinations</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="vaccination">Vaccination</option>
                <option value="medicine">Medicine</option>
                <option value="supplement">Supplement</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-1">Medication/Vaccine Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Dosage (optional)</label>
              <input
                type="text"
                value={formData.dosage}
                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                placeholder="e.g., 1ml per bird"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Cost (optional)</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0.00"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-1">Notes (optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
                placeholder="Additional notes..."
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Name</th>
              <th className="border p-2 text-left">Dosage</th>
              <th className="border p-2 text-right">Cost</th>
              <th className="border p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    record.type === 'vaccination' ? 'bg-blue-100 text-blue-800' :
                    record.type === 'medicine' ? 'bg-purple-100 text-purple-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="border p-2">{record.name}</td>
                <td className="border p-2">{record.dosage || '-'}</td>
                <td className="border p-2 text-right">{record.cost ? `$${record.cost.toFixed(2)}` : '-'}</td>
                <td className="border p-2">{record.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-slate-900 text-center py-8">No medication records yet. Click "Add Record" to get started.</p>
        )}
      </div>
    </div>
  );
}

function FinancialsTab({ farm }: { farm: Farm }) {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: '',
    category: '',
    amount: '',
    description: '',
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/financial-records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/farm/financial-records', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: formData.date,
          type: formData.type,
          category: formData.category,
          amount: parseFloat(formData.amount),
          description: formData.description || undefined,
        }),
      });
      if (response.ok) {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          type: '',
          category: '',
          amount: '',
          description: '',
        });
        setShowForm(false);
        fetchRecords();
      }
    } catch (error) {
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Financial Records</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-900 mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-green-700">${totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-red-900 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-700">${totalExpense.toFixed(2)}</p>
        </div>
        <div className={`${netProfit >= 0 ? 'bg-blue-50' : 'bg-orange-50'} p-4 rounded-lg`}>
          <h3 className={`text-sm font-medium ${netProfit >= 0 ? 'text-blue-900' : 'text-orange-900'} mb-1`}>Net Profit</h3>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            ${netProfit.toFixed(2)}
          </p>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">Select Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Egg sales, Feed purchase, Labor"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-900 mb-1">Description (optional)</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
                placeholder="Additional details..."
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Record'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-[720px] w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Category</th>
              <th className="border p-2 text-right">Amount</th>
              <th className="border p-2 text-left">Description</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-sm ${
                    record.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="border p-2">{record.category}</td>
                <td className={`border p-2 text-right font-semibold ${
                  record.type === 'income' ? 'text-green-700' : 'text-red-700'
                }`}>
                  ${record.amount.toFixed(2)}
                </td>
                <td className="border p-2">{record.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {records.length === 0 && (
          <p className="text-slate-900 text-center py-8">No financial records yet. Click "Add Record" to get started.</p>
        )}
      </div>
    </div>
  );
}
