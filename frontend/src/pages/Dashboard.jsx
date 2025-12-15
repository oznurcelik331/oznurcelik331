import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, Briefcase, FileText, TrendingUp, LogOut, CheckSquare, Calendar, BarChart3, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Logo from '../components/Logo';
import LeadsTab from '../components/dashboard/LeadsTab';
import ProjectsTab from '../components/dashboard/ProjectsTab';
import QuotesTab from '../components/dashboard/QuotesTab';
import TasksTab from '../components/dashboard/TasksTab';
import AppointmentsTab from '../components/dashboard/AppointmentsTab';
import AnalyticsTab from '../components/dashboard/AnalyticsTab';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAnalytics();
  }, [token]);

  const fetchAnalytics = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const analyticsRes = await axios.get(`${BACKEND_URL}/api/analytics`, config);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Data fetch error:', error);
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
      toast.error('Veri yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    toast.success('Çıkış başarılı');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-2xl text-primary">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted" data-testid="dashboard-page">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 h-20">
          <div className="flex items-center gap-4">
            <Logo className="w-10 h-10" />
            <h1 className="font-serif text-2xl font-bold text-primary" data-testid="dashboard-title">
              CRM Yönetim Paneli
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-muted hover:text-accent transition-hover"
            data-testid="logout-button"
          >
            <LogOut size={18} />
            <span>Çıkış</span>
          </button>
        </div>
      </header>

      <div className="p-6 lg:p-12">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-6 mb-12" data-testid="analytics-cards">
          <Card data-testid="analytics-leads" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Müşteri Adayları</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.total_leads || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics?.new_leads || 0} yeni
              </p>
            </CardContent>
          </Card>

          <Card data-testid="analytics-projects" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Projeler</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.active_projects || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-quotes" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teklifler</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.quotes_sent || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-tasks" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen Görevler</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.pending_tasks || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-appointments" className="lg:col-span-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Randevular</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.upcoming_appointments || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-conversion" className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dönüşüm Oranı</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics?.conversion_rate || 0}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Lead'den projeye dönüşüm
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="space-y-8" data-testid="dashboard-tabs">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="leads" data-testid="leads-tab">
              <Users size={16} className="mr-2" />
              Müşteri Adayları
            </TabsTrigger>
            <TabsTrigger value="projects" data-testid="projects-tab">
              <Briefcase size={16} className="mr-2" />
              Projeler
            </TabsTrigger>
            <TabsTrigger value="quotes" data-testid="quotes-tab">
              <FileText size={16} className="mr-2" />
              Teklifler
            </TabsTrigger>
            <TabsTrigger value="tasks" data-testid="tasks-tab">
              <CheckSquare size={16} className="mr-2" />
              Görevler
            </TabsTrigger>
            <TabsTrigger value="appointments" data-testid="appointments-tab">
              <Calendar size={16} className="mr-2" />
              Randevular
            </TabsTrigger>
            <TabsTrigger value="analytics" data-testid="analytics-tab">
              <BarChart3 size={16} className="mr-2" />
              Raporlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads"><LeadsTab token={token} /></TabsContent>
          <TabsContent value="projects"><ProjectsTab token={token} /></TabsContent>
          <TabsContent value="quotes"><QuotesTab token={token} /></TabsContent>
          <TabsContent value="tasks"><TasksTab token={token} /></TabsContent>
          <TabsContent value="appointments"><AppointmentsTab token={token} /></TabsContent>
          <TabsContent value="analytics"><AnalyticsTab token={token} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;