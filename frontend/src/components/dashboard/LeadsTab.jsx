import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, Eye, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const LeadsTab = ({ token }) => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/api/leads`, config);
      setLeads(response.data);
    } catch (error) {
      toast.error('Leadler yüklenemedi');
    }
  };

  const updateLeadStatus = async (leadId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${BACKEND_URL}/api/leads/${leadId}`, { status }, config);
      toast.success('Durum güncellendi');
      fetchLeads();
    } catch (error) {
      toast.error('Güncelleme hatası');
    }
  };

  const updateLeadScore = async (leadId, score) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${BACKEND_URL}/api/leads/${leadId}`, { score }, config);
      toast.success('Puan güncellendi');
      fetchLeads();
    } catch (error) {
      toast.error('Güncelleme hatası');
    }
  };

  const addNote = async (leadId) => {
    if (!newNote.trim()) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${BACKEND_URL}/api/leads/${leadId}/notes`, { lead_id: leadId, note: newNote }, config);
      toast.success('Not eklendi');
      setNewNote('');
      fetchLeadDetails(leadId);
    } catch (error) {
      toast.error('Not eklenemedi');
    }
  };

  const convertToProject = async (leadId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${BACKEND_URL}/api/leads/${leadId}/convert-to-project`, {}, config);
      toast.success('Lead projeye dönüştürüldü!');
      fetchLeads();
      setShowDetails(false);
    } catch (error) {
      toast.error('Dönüştürme hatası');
    }
  };

  const fetchLeadDetails = async (leadId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/api/leads/${leadId}`, config);
      setSelectedLead(response.data);
    } catch (error) {
      toast.error('Detaylar yüklenemedi');
    }
  };

  const openLeadDetails = async (lead) => {
    await fetchLeadDetails(lead.id);
    setShowDetails(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Müşteri Adayları</CardTitle>
        <CardDescription>Web sitesinden gelen müşteri talepleri ve lead yönetimi</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {leads.length === 0 ? (
            <p className="text-center text-muted py-8">Henüz müşteri adayı yok</p>
          ) : (
            leads.map((lead) => (
              <div
                key={lead.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                data-testid={`lead-item-${lead.id}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-primary mb-1">{lead.name}</h3>
                    <p className="text-sm text-muted">{lead.email} | {lead.phone}</p>
                    <p className="text-sm mt-2">{lead.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openLeadDetails(lead)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Detaylar"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 items-center">
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status === 'new' && 'Yeni'}
                    {lead.status === 'contacted' && 'İletişime Geçildi'}
                    {lead.status === 'qualified' && 'Nitelikli'}
                    {lead.status === 'converted' && 'Dönüştürüldü'}
                  </span>
                  
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className="text-xs border rounded px-2 py-1"
                  >
                    <option value="new">Yeni</option>
                    <option value="contacted">İletişime Geçildi</option>
                    <option value="qualified">Nitelikli</option>
                    <option value="converted">Dönüştürüldü</option>
                  </select>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Puan:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={lead.score || 0}
                      onChange={(e) => updateLeadScore(lead.id, parseInt(e.target.value))}
                      className="w-16 text-xs border rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Lead Details Modal */}
        {showDetails && selectedLead && (
          <Dialog open={showDetails} onOpenChange={setShowDetails}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-serif">{selectedLead.name}</DialogTitle>
                <DialogDescription>
                  {selectedLead.email} | {selectedLead.phone}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 mt-4">
                <div>
                  <h4 className="font-semibold mb-2">Mesaj:</h4>
                  <p className="text-sm text-muted">{selectedLead.message}</p>
                </div>

                {selectedLead.budget && (
                  <div>
                    <h4 className="font-semibold mb-2">Bütçe:</h4>
                    <p className="text-sm">{selectedLead.budget.toLocaleString('tr-TR')} ₺</p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Notlar:</h4>
                  <div className="space-y-2 mb-3">
                    {selectedLead.notes && selectedLead.notes.length > 0 ? (
                      selectedLead.notes.map((note, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded text-sm">
                          <p>{note.note}</p>
                          <p className="text-xs text-muted mt-1">{note.created_by} - {new Date(note.created_at).toLocaleString('tr-TR')}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">Henüz not eklenmemiş</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Yeni not ekle..."
                      className="flex-1 border rounded px-3 py-2 text-sm"
                    />
                    <button
                      onClick={() => addNote(selectedLead.id)}
                      className="btn-primary px-4 py-2 text-xs"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

                {selectedLead.status !== 'converted' && (
                  <button
                    onClick={() => convertToProject(selectedLead.id)}
                    className="btn-accent w-full flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={18} />
                    Projeye Dönüştür
                  </button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default LeadsTab;