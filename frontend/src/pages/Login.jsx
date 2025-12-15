import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      toast.success(isLogin ? 'Giriş başarılı!' : 'Kayıt başarılı!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.response?.data?.detail || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center py-12 px-6" data-testid="login-page">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 card-shadow">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl font-bold text-primary mb-2" data-testid="login-title">
              Kozsağ Group
            </h1>
            <p className="font-sans text-sm text-muted">
              {isLogin ? 'Yönetim Paneli Girişi' : 'Yeni Hesap Oluştur'}
            </p>
          </div>

          <form onSubmit={handleSubmit} data-testid="login-form">
            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block font-sans text-sm font-medium text-primary mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:border-accent"
                    data-testid="login-form-name"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="block font-sans text-sm font-medium text-primary mb-2">
                  E-posta
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-accent"
                  data-testid="login-form-email"
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-sans text-sm font-medium text-primary mb-2">
                  Şifre
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:border-accent"
                  data-testid="login-form-password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-accent w-full disabled:opacity-50"
                data-testid="login-form-submit"
              >
                {loading ? 'Yükleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-sans text-sm text-accent hover:underline"
              data-testid="toggle-auth-mode"
            >
              {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;