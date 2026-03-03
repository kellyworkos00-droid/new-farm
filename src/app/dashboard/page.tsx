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
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const router = useRouter();

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', mobileLabel: 'Home', Icon: OverviewIcon },
    { id: 'coops', label: 'Coops', mobileLabel: 'Coops', Icon: CoopIcon },
    { id: 'egg-production', label: 'Egg Prod.', mobileLabel: 'Eggs', Icon: EggIcon },
    { id: 'health', label: 'Health', mobileLabel: 'Health', Icon: HealthIcon },
    { id: 'feed', label: 'Feed Mgmt.', mobileLabel: 'Feed', Icon: FeedIcon },
    { id: 'medications', label: 'Meds', mobileLabel: 'Meds', Icon: MedicationIcon },
    { id: 'financials', label: 'Finance', mobileLabel: 'Money', Icon: FinanceIcon },
  ];

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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading your farm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-28 sm:pt-20 sm:pb-8">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-2.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            {/* Logo and Farm Info */}
            <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div className="shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-sm">
                <CoopIcon className="text-white" size={20} />
              </div>
              {farm && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 sm:text-base">
                    {farm.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    📍 {farm.location || 'Kenya'}
                  </p>
                </div>
              )}
            </div>
            
            {/* User Info + Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">Welcome</p>
                <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'profile'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <ProfileIcon size={16} className={activeTab === 'profile' ? 'text-white' : 'text-slate-600'} />
                <span className="hidden sm:inline">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        {!farm ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <p className="text-slate-900 text-center text-lg font-semibold">Loading farm information...</p>
          </div>
        ) : (
          <div>
            {/* Tab Content */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8 lg:p-10">
              {activeTab === 'overview' && <OverviewTab farm={farm} showToast={showToast} />}
              {activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} showToast={showToast} />}
              {activeTab === 'coops' && <CoopsTab farm={farm} showToast={showToast} />}
              {activeTab === 'egg-production' && <EggProductionTab farm={farm} showToast={showToast} />}
              {activeTab === 'health' && <HealthTab farm={farm} showToast={showToast} />}
              {activeTab === 'feed' && <FeedTab farm={farm} showToast={showToast} />}
              {activeTab === 'medications' && <MedicationsTab farm={farm} showToast={showToast} />}
              {activeTab === 'financials' && <FinancialsTab farm={farm} showToast={showToast} />}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg rounded-3xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-2xl transition-all duration-300">
        <div className="flex flex-wrap justify-center gap-1 px-2 py-3 sm:px-4 sm:py-3">
          {navItems.map(({ id, mobileLabel, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 text-[11px] font-bold rounded-2xl transition-all duration-300 hover:scale-110 ${
                activeTab === id
                  ? 'bg-slate-900 text-white shadow-md scale-110'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={mobileLabel}
            >
              <Icon size={18} className={activeTab === id ? 'text-white' : 'text-slate-500'} />
              <span className="text-[9px] leading-none">{mobileLabel}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Top Navigation */}
      <div className="fixed left-1/2 top-[72px] z-40 hidden w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 rounded-3xl border border-slate-200 bg-white/95 shadow-lg backdrop-blur-2xl transition-all duration-300 sm:flex">
        <div className="flex flex-wrap justify-center gap-2 px-3 py-3 lg:px-6">
          {navItems.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-3 py-2.5 text-xs lg:text-sm font-bold whitespace-nowrap rounded-xl transition-all duration-300 hover:scale-105 ${
                activeTab === id
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={18} className={activeTab === id ? 'text-white' : 'text-slate-500'} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-6 py-4 rounded-xl shadow-2xl border-2 transform transition-all duration-500 ${
          toast.type === 'success' 
            ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
            : 'bg-red-50 border-red-500 text-red-900'
        } animate-slide-in`}>
          <div className="flex items-center gap-3">
            {toast.type === 'success' ? (
              <CheckIcon className="text-emerald-600" size={24} />
            ) : (
              <AlertIcon className="text-red-600" size={24} />
            )}
            <p className="font-semibold">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Add padding for floating navs */}
      <div className="h-0" />
    </div>
  );
}

// Simple tab components
function ProfileTab({ user, onLogout, showToast }: { user: User | null; onLogout: () => void; showToast: (msg: string, type?: 'success' | 'error') => void }) {
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
      <h2 className="mb-6 text-2xl font-bold text-slate-900 sm:mb-8 sm:text-3xl">Profile & Farm Settings</h2>
      
      {/* User Information */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 sm:mb-8 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <ProfileIcon className="text-slate-700" size={24} />
          </div>
          <h3 className="font-bold text-xl text-slate-900">User Information</h3>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">Full Name</label>
            <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{user.name}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">Email Address</label>
            <p className="text-lg sm:text-xl font-bold text-slate-900 break-all mt-1">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Farm Information */}
      {farm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 sm:mb-8 sm:p-8">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <CoopIcon className="text-slate-700" size={24} />
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
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-slate-800"
            >
              {isEditing ? 'Cancel' : 'âœŽ Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateFarm} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                  ðŸšœ Farm Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition-all duration-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">
                  ðŸ“ Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition-all duration-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-6 py-3 font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'âœ“ Save Changes'}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">ðŸšœ Farm Name</label>
                <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{farm.name}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <label className="text-xs sm:text-sm font-bold text-slate-700 uppercase tracking-wide">ðŸ“ Location</label>
                <p className="text-lg sm:text-xl font-bold text-slate-900 mt-1">{farm.location}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Security Section */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:mb-8">
        <div className="flex gap-3">
          <div className="h-fit rounded-lg border border-slate-200 bg-white p-2">
            <AlertIcon className="text-slate-700" size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 sm:text-base">
              <strong>Security Note:</strong> This application is designed for single-user farm management. Your login provides complete access to all farm records. Keep your credentials secure.
            </p>
          </div>
        </div>
      </div>

      {/* Logout Section */}
      <div className="flex flex-col gap-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-lg font-bold uppercase tracking-wide text-white shadow-sm transition-all duration-200 hover:bg-slate-800"
        >
          <LogoutIcon size={22} />
          <span>Logout from Farm</span>
        </button>
      </div>
    </div>
  );
}

function OverviewTab({ farm, showToast }: { farm: Farm; showToast: (msg: string, type?: 'success' | 'error') => void }) {
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
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-40 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
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
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in" style={{ animationDelay: '0ms' }}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <CoopIcon size={24} className="text-slate-700" />
              </div>
            </div>
            <p className="mb-1 text-sm font-medium text-slate-600">Active Coops</p>
            <p className="mb-2 text-4xl font-bold text-slate-900">{analytics.totalCoops}</p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CapacityIcon size={16} />
              <span>Capacity: {analytics.totalCapacity} birds</span>
            </div>
          </div>
        </div>

        {/* Today's Eggs Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <EggIcon size={24} className="text-slate-700" />
              </div>
            </div>
            <p className="mb-1 text-sm font-medium text-slate-600">Today's Production</p>
            <p className="mb-2 text-4xl font-bold text-slate-900">{Math.floor(analytics.todayEggs / 30)} <span className="text-lg text-slate-600">crates ({analytics.todayEggs} eggs)</span></p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>This week: {Math.floor(analytics.weekEggs / 30)} crates ({analytics.weekEggs} eggs)</span>
            </div>
          </div>
        </div>

        {/* Net Profit Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <FinanceIcon size={24} className="text-slate-700" />
              </div>
            </div>
            <p className="mb-1 text-sm font-medium text-slate-600">Net Profit</p>
            <p className="mb-2 text-4xl font-bold text-slate-900">KES {analytics.netProfit.toFixed(2)}</p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Income: KES {analytics.totalIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Health Alerts Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div className="rounded-xl bg-slate-100 p-3">
                <HealthIcon size={24} className="text-slate-700" />
              </div>
            </div>
            <p className="mb-1 text-sm font-medium text-slate-600">Health Incidents</p>
            <p className="mb-2 text-4xl font-bold text-slate-900">{analytics.healthIncidents}</p>
            <div className="flex items-center gap-2 text-sm text-slate-600">
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
            <div className="p-2 bg-slate-100 rounded-xl">
              <TrendUpIcon size={24} className="text-slate-600" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Egg Production Trend</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-900 font-medium">Today</span>
                <span className="font-bold text-slate-900">{Math.floor(analytics.todayEggs / 30)} crates <span className="text-slate-600 font-normal">({analytics.todayEggs} eggs)</span></span>
              </div>
              <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="flex h-full items-center justify-end rounded-full bg-slate-500 px-2 transition-all duration-500"
                  style={{ width: `${Math.min((analytics.todayEggs / Math.max(analytics.weekEggs, 1)) * 100, 100)}%` }}
                >
                  <span className="text-white text-xs font-bold">{analytics.todayEggs > 0 ? Math.round((analytics.todayEggs / Math.max(analytics.weekEggs, 1)) * 100) + '%' : ''}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-900 font-medium">This Week</span>
                <span className="font-bold text-slate-900">{Math.floor(analytics.weekEggs / 30)} crates <span className="text-slate-600 font-normal">({analytics.weekEggs} eggs)</span></span>
              </div>
              <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                <div 
                  className="flex h-full items-center justify-end rounded-full bg-slate-600 px-2 transition-all duration-500"
                  style={{ width: `${Math.min((analytics.weekEggs / Math.max(analytics.monthEggs, 1)) * 100, 100)}%` }}
                >
                  <span className="text-white text-xs font-bold">{analytics.weekEggs > 0 ? Math.round((analytics.weekEggs / Math.max(analytics.monthEggs, 1)) * 100) + '%' : ''}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-900 font-medium">This Month</span>
                <span className="font-bold text-slate-900">{Math.floor(analytics.monthEggs / 30)} crates <span className="text-slate-600 font-normal">({analytics.monthEggs} eggs)</span></span>
              </div>
              <div className="bg-slate-100 rounded-full h-4 overflow-hidden">
                <div className="flex h-full w-full items-center justify-end rounded-full bg-slate-700 px-2 transition-all duration-500">
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
            <div className="p-2 bg-slate-100 rounded-xl">
              <FinanceIcon size={24} className="text-slate-600" />
            </div>
            <h3 className="font-bold text-xl text-slate-900">Financial Summary</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white from-slate-50 to-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-slate-600">KES {analytics.totalIncome.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl">
                <TrendUpIcon size={24} className="text-slate-600" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-white from-slate-50 to-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">Total Expenses</p>
                <p className="text-2xl font-bold text-slate-600">KES {analytics.totalExpenses.toFixed(2)}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl">
                <FinanceIcon size={24} className="text-slate-600" />
              </div>
            </div>
            <div className="flex items-center justify-between p-5 bg-white from-slate-50 to-slate-50 rounded-xl border-2 border-slate-300 shadow-md">
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-1">Net Profit</p>
                <p className={`text-3xl font-bold ${analytics.netProfit >= 0 ? 'text-slate-600' : 'text-slate-600'}`}>
                  KES {analytics.netProfit.toFixed(2)}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${analytics.netProfit >= 0 ? 'bg-slate-100' : 'bg-slate-100'}`}>
                <CheckIcon size={28} className={analytics.netProfit >= 0 ? 'text-slate-600' : 'text-slate-600'} />
              </div>
            </div>
          </div>
          {analytics.totalIncome > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 font-medium">Profit Margin</span>
                <span className={`text-2xl font-bold ${analytics.netProfit >= 0 ? 'text-slate-600' : 'text-slate-600'}`}>
                  {((analytics.netProfit / analytics.totalIncome) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Farm Info */}
      <div className="bg-white from-slate-50 via-slate-50 to-slate-50 border border-slate-200 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-slate-100 rounded-xl">
            <CoopIcon size={24} className="text-slate-600" />
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
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 border border-slate-200">
              <CheckIcon size={16} />
              <span>Active & Operational</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoopsTab({ farm, showToast }: { farm: Farm; showToast: (msg: string, type?: 'success' | 'error') => void }) {
  const [coops, setCoops] = useState<Coop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', capacity: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCoops = coops.filter(coop => 
    coop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleEditClick = (coop: Coop) => {
    setEditingId(coop.id);
    setFormData({ name: coop.name, capacity: coop.capacity.toString() });
    setShowForm(true);
  };

  const handleDelete = async (coopId: string) => {
    if (!confirm('Are you sure you want to delete this coop?')) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/farm/coops/${coopId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        showToast('Coop deleted successfully', 'success');
        fetchCoops();
      } else {
        showToast('Failed to delete coop', 'error');
      }
    } catch (error) {
      console.error('Error deleting coop:', error);
      showToast('Error deleting coop', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (editingId) {
        // Update existing coop
        const response = await fetch(`/api/farm/coops/${editingId}`, {
          method: 'PUT',
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
          showToast('Coop updated successfully', 'success');
          setFormData({ name: '', capacity: '' });
          setEditingId(null);
          setShowForm(false);
          fetchCoops();
        } else {
          showToast('Failed to update coop', 'error');
        }
      } else {
        // Create new coop
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
          showToast('Coop created successfully', 'success');
          setFormData({ name: '', capacity: '' });
          setShowForm(false);
          fetchCoops();
        } else {
          showToast('Failed to create coop', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving coop:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', capacity: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Coops / Houses</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search coops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-48 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ name: '', capacity: '' });
              setShowForm(!showForm);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap"
          >
            {showForm ? 'Cancel' : '+ Add Coop'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white from-slate-50 to-slate-50 p-6 rounded-2xl mb-8 border border-slate-200 shadow-lg">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AddIcon size={24} className="text-slate-600" />
            {editingId ? 'Edit Coop' : 'Add New Coop'}
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Coop Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter coop name (e.g., Coop A)"
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
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
                className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all"
                required
              />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Coop' : 'Create Coop')}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {filteredCoops.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300">
          <CoopIcon size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-semibold text-lg mb-2">
            {searchTerm ? 'No coops found matching your search' : 'No coops added yet'}
          </p>
          <p className="text-slate-400 text-sm mb-6">
            {searchTerm ? 'Try a different search term' : 'Add your first coop to get started'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              + Add First Coop
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoops.map((coop, index) => (
            <div 
              key={coop.id} 
              className="group relative bg-white from-white to-slate-50 border-2 border-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
            <div className="absolute top-4 right-4 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
              <CoopIcon size={24} className="text-slate-600" />
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
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEditClick(coop)}
                  className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold text-sm transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(coop.id)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold text-sm transition-all disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

function EggProductionTab({ farm, showToast }: { farm: Farm; showToast: (msg: string, type?: 'success' | 'error') => void }) {
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
      const crateCount = parseInt(formData.quantity);
      const totalEggs = crateCount * 30; // Convert crates to eggs
      
      const response = await fetch('/api/farm/egg-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          coopId: formData.coopId,
          date: formData.date,
          quantity: totalEggs,
          grade: formData.grade || undefined,
          notes: formData.notes || undefined,
        }),
      });
      if (response.ok) {
        showToast('Egg production record added successfully', 'success');
        setFormData({
          coopId: '',
          date: new Date().toISOString().split('T')[0],
          quantity: '',
          grade: '',
          notes: '',
        });
        setShowForm(false);
        fetchRecords();
      } else {
        showToast('Failed to add egg production record', 'error');
      }
    } catch (error) {
      console.error('Error creating record:', error);
      showToast('Error adding record', 'error');
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
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
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
              <label className="block text-sm font-medium text-slate-900 mb-1">Number of Crates (30 eggs per crate)</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., 27"
                  required
                />
                {formData.quantity && (
                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm font-semibold text-emerald-700">
                    Total: {formData.quantity} crates = <span className="text-emerald-900">{parseInt(formData.quantity || '0') * 30} eggs</span>
                  </div>
                )}
              </div>
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
            className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
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
              <th className="border p-2 text-right">Production</th>
              <th className="border p-2 text-left">Grade</th>
              <th className="border p-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td className="border p-2">{new Date(record.date).toLocaleDateString()}</td>
                <td className="border p-2">{record.coop.name}</td>
                <td className="border p-2 text-right font-semibold">{Math.floor(record.quantity / 30)} crates <span className="text-slate-600 font-normal">({record.quantity} eggs)</span></td>
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

function HealthTab({ farm, showToast }: { farm: Farm; showToast: (msg: string, type?: 'success' | 'error') => void }) {
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
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
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
            className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
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
                    record.type === 'mortality' ? 'bg-slate-100 text-slate-800' :
                    record.type === 'illness' ? 'bg-slate-100 text-slate-800' :
                    record.type === 'vaccination' ? 'bg-slate-100 text-slate-800' :
                    'bg-slate-100 text-slate-800'
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

function FeedTab({ farm, showToast }: { farm: Farm; showToast: (msg: string, type?: 'success' | 'error') => void }) {
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
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
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
            className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
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
                <td className="border p-2 text-right">{record.cost ? `KES ${record.cost.toFixed(2)}` : '-'}</td>
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

function MedicationsTab({ farm, showToast }: { farm: Farm; showToast: (msg: string, type?: 'success' | 'error') => void }) {
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
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
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
            className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
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
                    record.type === 'vaccination' ? 'bg-slate-100 text-slate-800' :
                    record.type === 'medicine' ? 'bg-purple-100 text-purple-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="border p-2">{record.name}</td>
                <td className="border p-2">{record.dosage || '-'}</td>
                <td className="border p-2 text-right">{record.cost ? `KES ${record.cost.toFixed(2)}` : '-'}</td>
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

function FinancialsTab({ farm, showToast }: { farm: Farm; showToast: (msg: string, type?: 'success' | 'error') => void }) {
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
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Cancel' : '+ Add Record'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-900 mb-1">Total Income</h3>
          <p className="text-2xl font-bold text-slate-700">KES {totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-900 mb-1">Total Expenses</h3>
          <p className="text-2xl font-bold text-slate-700">KES {totalExpense.toFixed(2)}</p>
        </div>
        <div className={`${netProfit >= 0 ? 'bg-slate-50' : 'bg-slate-50'} p-4 rounded-lg`}>
          <h3 className={`text-sm font-medium ${netProfit >= 0 ? 'text-slate-900' : 'text-slate-900'} mb-1`}>Net Profit</h3>
          <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-slate-700' : 'text-slate-700'}`}>
            KES {netProfit.toFixed(2)}
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
            className="mt-4 bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
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
                    record.type === 'income' ? 'bg-slate-100 text-slate-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {record.type}
                  </span>
                </td>
                <td className="border p-2">{record.category}</td>
                <td className={`border p-2 text-right font-semibold ${
                  record.type === 'income' ? 'text-slate-700' : 'text-slate-700'
                }`}>
                  KES {record.amount.toFixed(2)}
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


