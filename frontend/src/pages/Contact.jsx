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
      icon: <MapPin size={24} strokeWidth={1.5} />,
      title: 'Adres',
      content: 'Yaya Mah. E-87 Karayolu Kenarı Sk. No: 31/B İç Kapı No: 14 Gömeç/Balıkesir',
    },
    {
      icon: <Phone size={24} strokeWidth={1.5} />,
      title: 'Telefon',
      content: '0 544 852 63 71 / 0 554 852 63 51 / 0 537 330 04 42',
    },
    {
      icon: <Mail size={24} strokeWidth={1.5} />,
      title: 'E-posta',
      content: 'info@kozsaggroup.com',
    },
  ];

  return (
    <div className="contact-page" data-testid="contact-page">
      {/* Hero */}
      <section className="relative py-32 md:py-40 overflow-hidden" data-testid="contact-hero">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1750768145390-f0ad18d3e65b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBjb250YWN0JTIwY29tbXVuaWNhdGlvbiUyMG1lZXRpbmclMjBwcm9mZXNzaW9uYWwlMjB3b3Jrc3BhY2V8ZW58MHx8fHwxNzY1ODI5MTMxfDA&ixlib=rb-4.1.0&q=85"
            alt="İletişim"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.5)' }}
          />
        </div>
        <div className="relative container mx-auto px-6 md:px-12 lg:px-24 text-center z-10">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-8">
            BAĞLANTI
          </p>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-[0.9] text-white mb-8" data-testid="contact-title">
            İletişim
          </h1>
          <p className="text-base md:text-lg font-sans leading-relaxed text-white/80 max-w-2xl mx-auto">
            Size nasıl yardımcı olabiliriz?
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 md:py-40 bg-muted" data-testid="contact-section">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Contact Info */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-16">
                Bize Ulaşın
              </h2>
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-6"
                    data-testid={`contact-info-${index}`}
                  >
                    <div className="text-accent flex-shrink-0 mt-1">{info.icon}</div>
                    <div>
                      <div className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-2">
                        {info.title}
                      </div>
                      <div className="text-base font-sans text-primary leading-relaxed">{info.content}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 p-8 bg-accent text-white">
                <h3 className="text-xl font-serif font-medium mb-4">Çalışma Saatleri</h3>
                <div className="space-y-2 text-sm font-sans">
                  <p>Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p>Cumartesi: 09:00 - 14:00</p>
                  <p>Pazar: Kapalı</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-primary mb-12">
                Mesaj Gönderin
              </h2>
              <form onSubmit={handleSubmit} data-testid="contact-form">
                <div className="space-y-8">
                  <div>
                    <label htmlFor="name" className="block text-xs font-sans uppercase tracking-[0.2em] text-primary font-bold mb-4">
                      Adınız Soyadınız
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-stone-300 focus:border-accent px-0 py-4 rounded-none outline-none transition-colors placeholder:text-stone-400"
                      data-testid="contact-form-name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-sans uppercase tracking-[0.2em] text-primary font-bold mb-4">
                      E-posta
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-stone-300 focus:border-accent px-0 py-4 rounded-none outline-none transition-colors placeholder:text-stone-400"
                      data-testid="contact-form-email"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-xs font-sans uppercase tracking-[0.2em] text-primary font-bold mb-4">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-transparent border-b border-stone-300 focus:border-accent px-0 py-4 rounded-none outline-none transition-colors placeholder:text-stone-400"
                      data-testid="contact-form-phone"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs font-sans uppercase tracking-[0.2em] text-primary font-bold mb-4">
                      Mesajınız
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-transparent border-b border-stone-300 focus:border-accent px-0 py-4 rounded-none outline-none transition-colors placeholder:text-stone-400 resize-none"
                      data-testid="contact-form-message"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid="contact-form-submit"
                  >
                    {loading ? 'GÖNDERİLİYOR...' : 'MESAJ GÖNDER'}
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