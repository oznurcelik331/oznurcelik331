import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import Logo from './Logo';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white" data-testid="footer">
      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="transition-transform duration-300 group-hover:scale-110">
                <Logo className="transition-all duration-300" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold block leading-tight">Kozsağ Group</span>
                <span className="font-sans text-xs text-accent uppercase tracking-widest">İnşaat</span>
              </div>
            </Link>
            <p className="font-sans text-sm leading-relaxed opacity-80 max-w-md">
              20+ yıllık deneyimimizle, doğal taş ve modern mühendisliği birleştirerek, 
              nesiller boyu devam edecek prestijli yapılar oluşturuyoruz.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-sans text-sm opacity-80 hover:opacity-100 hover:text-accent transition-hover">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/hakkimizda" className="font-sans text-sm opacity-80 hover:opacity-100 hover:text-accent transition-hover">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link to="/projeler" className="font-sans text-sm opacity-80 hover:opacity-100 hover:text-accent transition-hover">
                  Projeler
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="font-sans text-sm opacity-80 hover:opacity-100 hover:text-accent transition-hover">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif text-lg font-semibold mb-4">İletişim</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="flex-shrink-0 mt-1 text-accent" />
                <span className="font-sans text-sm opacity-80">
                  Yaya Mah. E-87 Karayolu Kenarı Sk. No: 31/B<br />
                  İç Kapı No: 14 Gömeç/Balıkesir
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="flex-shrink-0 mt-1 text-accent" />
                <div className="font-sans text-sm opacity-80">
                  <div>0 544 852 63 71</div>
                  <div>0 554 852 63 51</div>
                  <div>0 537 330 04 42</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="flex-shrink-0 mt-1 text-accent" />
                <span className="font-sans text-sm opacity-80">info@kozsaggroup.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans text-sm opacity-60">
              © {currentYear} Kozsağ Group İnşaat. Tüm hakları saklıdır.
            </p>
            <p className="font-sans text-xs opacity-40">
              Doğal Taş İnşaat Uzmanı
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;