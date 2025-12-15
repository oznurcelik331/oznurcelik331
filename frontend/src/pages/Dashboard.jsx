import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Users, Briefcase, FileText, TrendingUp, LogOut, Menu, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import Logo from '../components/Logo';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [projects, setProjects] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [leadsRes, projectsRes, quotesRes, analyticsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/leads`, config),
        axios.get(`${BACKEND_URL}/api/projects`, config),
        axios.get(`${BACKEND_URL}/api/quotes`, config),
        axios.get(`${BACKEND_URL}/api/analytics`, config),
      ]);

      setLeads(leadsRes.data);
      setProjects(projectsRes.data);
      setQuotes(quotesRes.data);
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

  const updateLeadStatus = async (leadId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${BACKEND_URL}/api/leads/${leadId}`, { status }, config);
      toast.success('Durum güncellendi');
      fetchData();
    } catch (error) {
      toast.error('Güncelleme hatası');
    }
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
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
              data-testid="toggle-sidebar-button"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Logo className="w-8 h-8" />
            <h1 className="font-serif text-xl font-bold text-primary" data-testid="dashboard-title">
              Yönetim Paneli
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

      <div className="p-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" data-testid="analytics-cards">
          <Card data-testid="analytics-leads">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Müşteri Adayları</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.total_leads || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.new_leads || 0} yeni müşteri adayı
              </p>
            </CardContent>
          </Card>

          <Card data-testid="analytics-projects">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktif Projeler</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.active_projects || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-quotes">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gönderilen Teklifler</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.quotes_sent || 0}</div>
            </CardContent>
          </Card>

          <Card data-testid="analytics-conversion">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dönüşüm Oranı</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.conversion_rate || 0}%</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="leads" className="space-y-4" data-testid="dashboard-tabs">
          <TabsList>
            <TabsTrigger value="leads" data-testid="leads-tab">Müşteri Adayları</TabsTrigger>
            <TabsTrigger value="projects" data-testid="projects-tab">Projeler</TabsTrigger>
            <TabsTrigger value="quotes" data-testid="quotes-tab">Teklifler</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4" data-testid="leads-content">
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Adayları</CardTitle>
                <CardDescription>Web sitesinden gelen müşteri talepleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.length === 0 ? (
                    <p className="text-center text-muted py-8">Henüz müşteri adayı yok</p>
                  ) : (
                    leads.map((lead) => (
                      <div
                        key={lead.id}
                        className="border-b pb-4 last:border-0"
                        data-testid={`lead-item-${lead.id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium text-primary">{lead.name}</h3>
                            <p className="text-sm text-muted">{lead.email} | {lead.phone}</p>
                          </div>
                          <select
                            value={lead.status}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                            data-testid={`lead-status-${lead.id}`}
                          >
                            <option value="new">Yeni</option>
                            <option value="contacted">Iletişime Geçildi</option>
                            <option value="qualified">Nitelikli</option>
                            <option value="converted">Dönüştürüldü</option>
                          </select>
                        </div>
                        <p className="text-sm">{lead.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4" data-testid="projects-content">
            <Card>
              <CardHeader>
                <CardTitle>Projeler</CardTitle>
                <CardDescription>Aktif ve tamamlanmış projeler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.length === 0 ? (
                    <p className="text-center text-muted py-8">Henüz proje yok</p>
                  ) : (
                    projects.map((project) => (
                      <div
                        key={project.id}
                        className="border-b pb-4 last:border-0"
                        data-testid={`project-item-${project.id}`}
                      >
                        <h3 className="font-medium text-primary">{project.title}</h3>
                        <p className="text-sm text-muted">{project.location} | {project.area}</p>
                        <p className="text-sm mt-2">{project.description}</p>
                        <span className="inline-block mt-2 text-xs bg-accent text-white px-2 py-1 rounded">
                          {project.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4" data-testid="quotes-content">
            <Card>
              <CardHeader>
                <CardTitle>Teklifler</CardTitle>
                <CardDescription>Gönderilen fiyat teklifleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {quotes.length === 0 ? (
                    <p className="text-center text-muted py-8">Henüz teklif yok</p>
                  ) : (
                    quotes.map((quote) => (
                      <div
                        key={quote.id}
                        className="border-b pb-4 last:border-0"
                        data-testid={`quote-item-${quote.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-primary">{quote.project_type}</h3>
                            <p className="text-sm text-muted">{quote.area} m²</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-accent">
                              {quote.estimated_cost.toLocaleString('tr-TR')} ₺
                            </p>
                            <span className="text-xs text-muted">{quote.status}</span>
                          </div>
                        </div>
                        <p className="text-sm mt-2">{quote.details}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;