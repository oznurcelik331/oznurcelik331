import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ProjectsTab = ({ token }) => {
  const [projects, setProjects] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    location: '',
    area: '',
    budget: '',
    status: 'planning'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/api/projects`, config);
      setProjects(response.data);
    } catch (error) {
      toast.error('Projeler yüklenemedi');
    }
  };

  const createProject = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`${BACKEND_URL}/api/projects`, {
        ...newProject,
        budget: newProject.budget ? parseFloat(newProject.budget) : null
      }, config);
      toast.success('Proje oluşturuldu');
      setShowCreateForm(false);
      setNewProject({ title: '', description: '', location: '', area: '', budget: '', status: 'planning' });
      fetchProjects();
    } catch (error) {
      toast.error('Proje oluşturulamadı');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planning: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      on_hold: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Projeler</CardTitle>
            <CardDescription>Aktif ve tamamlanmış projeler</CardDescription>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-accent flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Yeni Proje
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-center text-muted py-8">Henüz proje yok</p>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                data-testid={`project-item-${project.id}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-primary">{project.title}</h3>
                    <p className="text-sm text-muted">{project.location} | {project.area}</p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(project.status)}`}>
                    {project.status === 'planning' && 'Planlama'}
                    {project.status === 'in_progress' && 'Devam Ediyor'}
                    {project.status === 'completed' && 'Tamamlandı'}
                    {project.status === 'on_hold' && 'Beklemede'}
                  </span>
                </div>
                <p className="text-sm mb-3">{project.description}</p>
                {project.budget && (
                  <p className="text-sm font-semibold text-accent">
                    Bütçe: {project.budget.toLocaleString('tr-TR')} ₺
                  </p>
                )}
                {project.progress > 0 && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span>İlerleme</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create Project Modal */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Yeni Proje Oluştur</DialogTitle>
              <DialogDescription>Yeni bir inşaat projesi ekleyin</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Proje Adı</label>
                <input
                  type="text"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="örn: Villa Projesi - Ahmet Bey"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Proje detayları..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Konum</label>
                  <input
                    type="text"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Şehir, ilçe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Alan (m²)</label>
                  <input
                    type="text"
                    value={newProject.area}
                    onChange={(e) => setNewProject({ ...newProject, area: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                    placeholder="350 m²"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bütçe (₺)</label>
                <input
                  type="number"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="0"
                />
              </div>
              
              <button
                onClick={createProject}
                className="btn-primary w-full"
              >
                Proje Oluştur
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ProjectsTab;