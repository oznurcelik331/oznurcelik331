import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { PlusCircle, CheckCircle, Circle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const TasksTab = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(`${BACKEND_URL}/api/tasks`, config);
      setTasks(response.data);
    } catch (error) {
      toast.error('Görevler yüklenemedi');
    }
  };

  const createTask = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const taskData = {
        ...newTask,
        due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null
      };
      await axios.post(`${BACKEND_URL}/api/tasks`, taskData, config);
      toast.success('Görev oluşturuldu');
      setShowCreateForm(false);
      setNewTask({ title: '', description: '', priority: 'medium', due_date: '' });
      fetchTasks();
    } catch (error) {
      toast.error('Görev oluşturulamadı');
    }
  };

  const updateTaskStatus = async (taskId, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.patch(`${BACKEND_URL}/api/tasks/${taskId}?status=${status}`, {}, config);
      toast.success('Görev güncellendi');
      fetchTasks();
    } catch (error) {
      toast.error('Güncelleme hatası');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Görevler</CardTitle>
            <CardDescription>Yapılacaklar listesi ve görev takibi</CardDescription>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-accent flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Yeni Görev
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-center text-muted py-8">Henüz görev yok</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  task.status === 'completed' ? 'opacity-60' : ''
                }`}
                data-testid={`task-item-${task.id}`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                    className="mt-1"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Circle className="text-gray-400" size={20} />
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-semibold text-primary ${
                        task.status === 'completed' ? 'line-through' : ''
                      }`}>
                        {task.title}
                      </h3>
                      <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'low' && 'Düşük'}
                        {task.priority === 'medium' && 'Orta'}
                        {task.priority === 'high' && 'Yüksek'}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-1">{task.description}</p>
                    {task.due_date && (
                      <p className="text-xs text-muted mt-2">
                        Bitiş: {new Date(task.due_date).toLocaleDateString('tr-TR')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create Task Modal */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Yeni Görev Oluştur</DialogTitle>
              <DialogDescription>Yapılacaklar listesine görev ekleyin</DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-2">Görev Başlığı</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="örn: Ahmet Bey'i ara"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Açıklama</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder="Görev detayları..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Öncelik</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Bitiş Tarihi</label>
                  <input
                    type="date"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              
              <button
                onClick={createTask}
                className="btn-primary w-full"
              >
                Görev Oluştur
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TasksTab;