import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const QuotesTab = ({ token }) => {
  const [quotes, setQuotes] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuote, setNewQuote] = useState({
    lead_id: '',
    project_type: '',
    area: '',
    estimated_cost: '',
    details: '',
    valid_days: 30
  });

  useEffect(() => {
    fetchQuotes();
    fetchLeads();
  }, []);

  const fetchQuotes = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/api/quotes`, config);
      setQuotes(response.data);
    } catch (error) {
      toast.error('Teklifler yüklenemedi');
    }
  };

  const fetchLeads = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/api/leads`, config);
      setLeads(response.data);
    } catch (error) {
      console.error('Leads fetch error');
    }
  };

  const createQuote = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${BACKEND_URL}/api/quotes`, {
        ...newQuote,
        area: parseFloat(newQuote.area),
        estimated_cost: parseFloat(newQuote.estimated_cost),
        items: []
      }, config);
      toast.success('Teklif oluşturuldu');
      setShowCreateForm(false);
      setNewQuote({ lead_id: '', project_type: '', area: '', estimated_cost: '', details: '', valid_days: 30 });
      fetchQuotes();
    } catch (error) {
      toast.error('Teklif oluşturulamadı');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Teklifler</CardTitle>
            <CardDescription>Gönderilen fiyat teklifleri</CardDescription>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-accent flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Yeni Teklif
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {quotes.length === 0 ? (
            <p className="text-center text-muted py-8">Henüz teklif yok</p>
          ) : (
            quotes.map((quote) => (
              <div
                key={quote.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                data-testid={`quote-item-${quote.id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-primary">{quote.project_type}</h3>
                    <p className="text-sm text-muted">{quote.area} m²</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-accent">
                      {quote.estimated_cost.toLocaleString('tr-TR')} ₺
                    </p>
                    <span className="text-xs text-muted">{quote.status}</span>
                  </div>
                </div>
                <p className="text-sm mb-2">{quote.details}</p>
                <p className="text-xs text-muted">
                  Geçerlilik: {new Date(quote.valid_until).toLocaleDateString('tr-TR')}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Create Quote Modal */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Yeni Teklif Oluştur</DialogTitle>
              <DialogDescription>Müşteri için fiyat teklifi hazırlayın</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Müşteri Adayı</label>
                <select
                  value={newQuote.lead_id}
                  onChange={(e) => setNewQuote({ ...newQuote, lead_id: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Seçiniz</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Proje Tipi</label>
                <input
                  type="text"
                  value={newQuote.project_type}
                  onChange={(e) => setNewQuote({ ...newQuote, project_type: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="örn: Taş Villa İnşaatı"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Alan (m²)</label>
                  <input
                    type="number"
                    value={newQuote.area}
                    onChange={(e) => setNewQuote({ ...newQuote, area: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tahmini Maliyet (₺)</label>
                  <input
                    type="number"
                    value={newQuote.estimated_cost}
                    onChange={(e) => setNewQuote({ ...newQuote, estimated_cost: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Detaylar</label>
                <textarea
                  value={newQuote.details}
                  onChange={(e) => setNewQuote({ ...newQuote, details: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Teklif detayları..."
                />
              </div>
              
              <button
                onClick={createQuote}
                className="btn-primary w-full"
              >
                Teklif Oluştur
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default QuotesTab;