import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AppointmentsTab = ({ token }) => {
  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: '',
    description: '',
    appointment_date: '',
    duration_minutes: 60,
    location: '',
    lead_id: ''
  });

  useEffect(() => {
    fetchAppointments();
    fetchLeads();
  }, []);

  const fetchAppointments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/api/appointments`, config);
      setAppointments(response.data);
    } catch (error) {
      toast.error('Randevular yüklenemedi');
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

  const createAppointment = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const appointmentData = {
        ...newAppointment,
        appointment_date: new Date(newAppointment.appointment_date).toISOString(),
        duration_minutes: parseInt(newAppointment.duration_minutes)
      };
      await axios.post(`${BACKEND_URL}/api/appointments`, appointmentData, config);
      toast.success('Randevu oluşturuldu');
      setShowCreateForm(false);
      setNewAppointment({ title: '', description: '', appointment_date: '', duration_minutes: 60, location: '', lead_id: '' });
      fetchAppointments();
    } catch (error) {
      toast.error('Randevu oluşturulamadı');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Randevular</CardTitle>
            <CardDescription>Müşteri randevuları ve takvim</CardDescription>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-accent flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Yeni Randevu
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-center text-muted py-8">Henüz randevu yok</p>
          ) : (
            appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                data-testid={`appointment-item-${appointment.id}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded">
                    <CalendarIcon className="text-accent" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-primary">{appointment.title}</h3>
                    <p className="text-sm text-muted mt-1">{appointment.description}</p>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-muted" />
                        <span>{new Date(appointment.appointment_date).toLocaleString('tr-TR')}</span>
                      </div>
                      {appointment.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-muted" />
                          <span>{appointment.location}</span>
                        </div>
                      )}
                      <span className="text-muted">• {appointment.duration_minutes} dakika</span>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800">
                    {appointment.status === 'scheduled' && 'Planlandı'}
                    {appointment.status === 'completed' && 'Tamamlandı'}
                    {appointment.status === 'cancelled' && 'İptal'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Appointment Modal */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Yeni Randevu Oluştur</DialogTitle>
              <DialogDescription>Müşteri ile randevu planlayın</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Randevu Başlığı</label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="örn: Saha Görüşmesi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Müşteri (Opsiyonel)</label>
                <select
                  value={newAppointment.lead_id}
                  onChange={(e) => setNewAppointment({ ...newAppointment, lead_id: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Seçiniz</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  value={newAppointment.description}
                  onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={2}
                  placeholder="Randevu detayları..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tarih & Saat</label>
                  <input
                    type="datetime-local"
                    value={newAppointment.appointment_date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Süre (dakika)</label>
                  <input
                    type="number"
                    value={newAppointment.duration_minutes}
                    onChange={(e) => setNewAppointment({ ...newAppointment, duration_minutes: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Konum</label>
                <input
                  type="text"
                  value={newAppointment.location}
                  onChange={(e) => setNewAppointment({ ...newAppointment, location: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="örn: Ofis, Proje Sahası"
                />
              </div>
              
              <button
                onClick={createAppointment}
                className="btn-primary w-full"
              >
                Randevu Oluştur
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;