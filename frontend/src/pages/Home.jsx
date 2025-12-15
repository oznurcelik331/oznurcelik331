import { Link } from 'react-router-dom';
import { ArrowRight, Building2, CheckCircle, Award } from 'lucide-react';

const Home = () => {
  const projects = [
    { image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/eq3r10ut_1.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/ikfxog8t_6.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/6wpk62xx_11.jpeg' },
  ];

  const features = [
    {
      icon: <Building2 size={40} strokeWidth={1.5} />,
      title: 'İkamet Amaçlı Konut ve Taş Ev Uzmanlığı',
      description: 'Müstakil konutlar, taş evler ve apartman projelerinde anahtar teslim çözümler sunuyoruz.',
    },
    {
      icon: <CheckCircle size={40} strokeWidth={1.5} />,
      title: 'Şeffaf Bütçe ve Sözleşmeye Bağlı Yönetim',
      description: 'Tüm süreçleri şeffaf bir şekilde yönetir, sözleşmeye tam bağlı kalırız.',
    },
    {
      icon: <Award size={40} strokeWidth={1.5} />,
      title: 'Tek Elden Proje Yönetimi',
      description: 'Tasarım aşamasından anahtar teslimine kadar tüm süreci tek elden yönetiyoruz.',
    },
  ];

  return (
    <div className="home-page" data-testid="home-page">
      {/* Hero Section - Full Screen with Video */}
      <section className="relative h-screen overflow-hidden flex items-end" data-testid="hero-section">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) contrast(1.1)' }}
          >
            <source src="https://customer-assets.emergentagent.com/job_insaatech/artifacts/bsrk8xt9_24.mp4" type="video/mp4" />
            <img
              src="https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/eq3r10ut_1.jpeg"
              alt="KOZSAĞ GROUP"
              className="w-full h-full object-cover"
            />
          </video>
        </div>
        <div className="absolute inset-0 hero-overlay" />
        <div className="relative container mx-auto px-6 md:px-12 lg:px-24 pb-24 z-10">
          <div className="max-w-4xl text-white">
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-8" data-testid="hero-caption">
              İKAMET AMAÇLI BİNALARDA
            </p>
            <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-[0.9] mb-8" data-testid="hero-title">
              Anahtar Teslim<br />Profesyonel İnşaat<br />Çözümleri
            </h1>
            <p className="text-base md:text-lg font-sans leading-relaxed mb-12 max-w-2xl opacity-90" data-testid="hero-description">
              KOZSAĞ GROUP; taş evler, müstakil konutlar ve apartman projelerinde; 
              tasarım aşamasından anahtar teslimine kadar tüm süreci tek elden ve şeffaf yönetir.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/iletisim" data-testid="hero-contact-button">
                <button className="btn-accent hover-lift">
                  Ücretsiz Keşif Talep Et
                </button>
              </Link>
              <a 
                href="https://wa.me/905448526371" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="hero-whatsapp-button"
              >
                <button className="btn-secondary text-white border-white hover:bg-white hover:text-primary">
                  WhatsApp Destek
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 md:py-40 bg-white" data-testid="features-section">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-24">
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-6">
              FARKIMIZ
            </p>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-primary">
              Neden KOZSAĞ Group
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center"
                data-testid={`feature-card-${index}`}
              >
                <div className="text-accent mb-6 flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl md:text-3xl font-serif font-medium text-primary mb-6 leading-tight">
                  {feature.title}
                </h3>
                <p className="text-base font-sans text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-32 md:py-40 bg-muted" data-testid="projects-preview-section">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="text-center mb-24">
            <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-6">
              TAMAMLANAN PROJELER
            </p>
            <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-primary">
              Öne Çıkan İşlerimiz
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="project-card" data-testid={`project-preview-${index}`}>
                <img src={project.image} alt="KOZSAĞ GROUP Proje" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center mt-16">
            <Link to="/projeler" data-testid="view-all-projects-button">
              <button className="btn-primary hover-lift">
                Tüm Projeleri Görüntüle
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 bg-primary text-white" data-testid="cta-section">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight mb-8">
            Projenizi Birlikte Gerçekleştirelim
          </h2>
          <p className="text-base md:text-lg font-sans leading-relaxed mb-12 max-w-2xl mx-auto opacity-90">
            Hayalinizdeki taş evi inşa etmek için hemen iletişime geçin.
          </p>
          <Link to="/iletisim" data-testid="cta-contact-button">
            <button className="btn-accent hover-lift">
              İletişime Geçin
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;