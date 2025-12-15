import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AnalyticsTab = ({ token }) => {
  const [funnelData, setFunnelData] = useState(null);
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [funnelRes, revenueRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/analytics/funnel`, config),
        axios.get(`${BACKEND_URL}/api/analytics/revenue`, config)
      ]);
      
      setFunnelData(funnelRes.data);
      setRevenueData(revenueRes.data);
    } catch (error) {
      toast.error('Analitik veriler yüklenemedi');
    }
  };

  const calculateConversionRate = (current, previous) => {
    if (!previous || previous === 0) return 0;
    return ((current / previous) * 100).toFixed(1);
  };

  return (
    <div className="space-y-8">
      {/* Sales Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Satış Hunisi</CardTitle>
          <CardDescription>Lead'den projeye dönüşüm akışı</CardDescription>
        </CardHeader>
        <CardContent>
          {funnelData && (
            <div className="space-y-4">
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Users className="text-accent" size={24} />
                    <span className="font-semibold">Toplam Müşteri Adayları</span>
                  </div>
                  <span className="text-3xl font-bold">{funnelData.total_leads}</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="bg-accent h-full rounded-full transition-all flex items-center justify-end pr-4 text-white text-sm font-medium"
                    style={{ width: '100%' }}
                  >
                    100%
                  </div>
                </div>
              </div>

              <div className="relative ml-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-accent" size={20} />
                    <span className="font-semibold">Nitelikli Lead'ler</span>
                  </div>
                  <span className="text-2xl font-bold">{funnelData.qualified_leads}</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-7">
                  <div 
                    className="bg-accent h-full rounded-full transition-all flex items-center justify-end pr-4 text-white text-sm font-medium"
                    style={{ width: `${calculateConversionRate(funnelData.qualified_leads, funnelData.total_leads)}%` }}
                  >
                    {calculateConversionRate(funnelData.qualified_leads, funnelData.total_leads)}%
                  </div>
                </div>
              </div>

              <div className="relative ml-16">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <DollarSign className="text-accent" size={20} />
                    <span className="font-semibold">Gönderilen Teklifler</span>
                  </div>
                  <span className="text-2xl font-bold">{funnelData.quotes_sent}</span>
                </div>
                <div className="w-full bg-accent/20 rounded-full h-6">
                  <div 
                    className="bg-accent h-full rounded-full transition-all flex items-center justify-end pr-4 text-white text-xs font-medium"
                    style={{ width: `${calculateConversionRate(funnelData.quotes_sent, funnelData.qualified_leads)}%` }}
                  >
                    {calculateConversionRate(funnelData.quotes_sent, funnelData.qualified_leads)}%
                  </div>
                </div>
              </div>

              <div className="relative ml-24">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Briefcase className="text-green-600" size={20} />
                    <span className="font-semibold">Kazanılan Projeler</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{funnelData.projects_won}</span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-5">
                  <div 
                    className="bg-green-600 h-full rounded-full transition-all flex items-center justify-end pr-4 text-white text-xs font-medium"
                    style={{ width: `${calculateConversionRate(funnelData.projects_won, funnelData.quotes_sent)}%` }}
                  >
                    {calculateConversionRate(funnelData.projects_won, funnelData.quotes_sent)}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif text-2xl">Gelir Özeti</CardTitle>
          <CardDescription>Aylık proje gelir analizi</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueData && revenueData.monthly_revenue && (
            <div className="space-y-4">
              {Object.keys(revenueData.monthly_revenue).length === 0 ? (
                <p className="text-center text-muted py-8">Henüz gelir verisi yok</p>
              ) : (
                Object.entries(revenueData.monthly_revenue)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .map(([month, revenue]) => (
                    <div key={month} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-semibold text-primary">{month}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-accent">
                          {revenue.toLocaleString('tr-TR')} ₺
                        </span>
                      </div>
                    </div>
                  ))
              )}
              
              {Object.keys(revenueData.monthly_revenue).length > 0 && (
                <div className="mt-6 p-6 bg-accent/10 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted mb-2">Toplam Gelir</p>
                    <p className="text-4xl font-bold text-accent">
                      {Object.values(revenueData.monthly_revenue)
                        .reduce((sum, val) => sum + val, 0)
                        .toLocaleString('tr-TR')} ₺
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ortalama Proje Değeri</CardTitle>
          </CardHeader>
          <CardContent>
            {revenueData && revenueData.monthly_revenue && funnelData && (
              <p className="text-3xl font-bold text-accent">
                {funnelData.projects_won > 0
                  ? (Object.values(revenueData.monthly_revenue).reduce((sum, val) => sum + val, 0) / funnelData.projects_won).toLocaleString('tr-TR', { maximumFractionDigits: 0 })
                  : 0} ₺
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Lead Kazanma Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            {funnelData && (
              <p className="text-3xl font-bold text-green-600">
                {calculateConversionRate(funnelData.projects_won, funnelData.total_leads)}%
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Teklif Başarı Oranı</CardTitle>
          </CardHeader>
          <CardContent>
            {funnelData && (
              <p className="text-3xl font-bold text-blue-600">
                {calculateConversionRate(funnelData.projects_won, funnelData.quotes_sent)}%
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsTab;
