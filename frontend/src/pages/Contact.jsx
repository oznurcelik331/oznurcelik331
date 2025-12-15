import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${BACKEND_URL}/api/leads`, formData);
      toast.success('Mesajınız başarıyla gönderildi! En kısa sürede size döneceğiz.');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin size={24} />,
      title: 'Adres',
      content: 'İzmir, Türkiye',
    },
    {
      icon: <Phone size={24} />,
      title: 'Telefon',
      content: '+90 (232) 123 45 67',
    },
    {
      icon: <Mail size={24} />,
      title: 'E-posta',
      content: 'info@kozsaggroup.com',
    },
  ];

  return (
    <div className="contact-page" data-testid="contact-page">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden bg-primary" data-testid="contact-hero">
        <div className="absolute inset-0 noise-texture" />
        <div className="relative container mx-auto px-6 md:px-12 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6" data-testid="contact-title">
              İletişim
            </h1>
            <p className="font-sans text-base md:text-lg leading-relaxed opacity-90">
              Size nasıl yardımcı olabiliriz? Bize ulaşın.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-muted" data-testid="contact-section">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-8">
                Bize Ulaşın
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 bg-white p-6 card-shadow"
                    data-testid={`contact-info-${index}`}
                  >
                    <div className="text-accent flex-shrink-0">{info.icon}</div>
                    <div>
                      <div className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-1">
                        {info.title}
                      </div>
                      <div className="font-sans text-base text-primary">{info.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-accent text-white">
                <h3 className="font-serif text-xl font-medium mb-2">Çalışma Saatleri</h3>
                <p className="font-sans text-sm opacity-90">Pazartesi - Cuma: 09:00 - 18:00</p>
                <p className="font-sans text-sm opacity-90">Cumartesi: 09:00 - 14:00</p>
                <p className="font-sans text-sm opacity-90">Pazar: Kapalı</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 card-shadow">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold text-primary mb-6">
                Mesaj Gönderin
              </h2>
              <form onSubmit={handleSubmit} data-testid="contact-form">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block font-sans text-sm font-medium text-primary mb-2">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-accent transition-hover"
                      data-testid="contact-form-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-sans text-sm font-medium text-primary mb-2">
                      E-posta *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-accent transition-hover"
                      data-testid="contact-form-email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block font-sans text-sm font-medium text-primary mb-2">
                      Telefon *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-accent transition-hover"
                      data-testid="contact-form-phone"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block font-sans text-sm font-medium text-primary mb-2">
                      Mesajınız *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full p-3 border border-gray-300 focus:outline-none focus:border-accent transition-hover resize-none"
                      data-testid="contact-form-message"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-accent w-full hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="contact-form-submit"
                  >
                    {loading ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;