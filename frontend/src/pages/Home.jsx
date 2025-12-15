import { Link } from 'react-router-dom';
import { ArrowRight, Building2, Users, Award, CheckCircle } from 'lucide-react';

const Home = () => {
  const projects = [
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/eq3r10ut_1.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/drf0lqug_2.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/1bchysas_3.jpeg',
    },
  ];

  const features = [
    {
      icon: <Building2 size={32} />,
      title: 'İkamet Amaçlı Konut ve Taş Ev Uzmanlığı',
      description: 'Müstakil konutlar, taş evler ve apartman projelerinde anahtar teslim çözümler sunuyoruz.',
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Şeffaf Bütçe ve Sözleşmeye Bağlı Yönetim',
      description: 'Tüm süreçleri şeffaf bir şekilde yönetir, sözleşmeye tam bağlı kalırız.',
    },
    {
      icon: <Award size={32} />,
      title: 'Tek Elden Proje Yönetimi',
      description: 'Tasarım aşamasından anahtar teslimine kadar tüm süreci tek elden yönetiyoruz.',
    },
  ];

  return (
    <div className="home-page" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden" data-testid="hero-section">
        <img
          src="https://images.unsplash.com/photo-1548386704-23fc0135faab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdG9uZSUyMHZpbGxhJTIwd2l0aCUyMHBvb2wlMjBzdW5zZXR8ZW58MHx8fHwxNzY1ODE2OTQzfDA&ixlib=rb-4.1.0&q=85"
          alt="Kozsağ Group"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative container mx-auto px-6 md:px-12 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <p className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-6" data-testid="hero-caption">
              İkamet Amaçlı Binalarda
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6" data-testid="hero-title">
              Anahtar Teslim Profesyonel İnşaat Çözümleri
            </h1>
            <p className="font-sans text-base md:text-lg leading-relaxed mb-8 opacity-90" data-testid="hero-description">
              KOZSAĞ GROUP; taş evler, müstakil konutlar ve apartman projelerinde; 
              tasarım aşamasından anahtar teslimine kadar tüm süreci tek elden ve şeffaf yönetir.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/iletisim" data-testid="hero-contact-button">
                <button className="btn-accent hover-lift">
                  Ücretsiz Keşif Talep Et
                </button>
              </Link>
              <Link to="/iletisim" data-testid="hero-quote-button">
                <button className="btn-secondary text-white border-white hover:bg-white hover:text-primary">
                  Teklif Al
                </button>
              </Link>
              <a 
                href="https://wa.me/905448526371" 
                target="_blank" 
                rel="noopener noreferrer"
                data-testid="hero-whatsapp-button"
              >
                <button className="btn-secondary text-white border-white hover:bg-white hover:text-primary flex items-center gap-2">
                  WhatsApp Anında Destek
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white" data-testid="features-section">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-4">
              Neden Biz?
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-primary">
              Farkımız
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 border-l-4 border-accent card-shadow transition-hover hover:shadow-lg"
                data-testid={`feature-card-${index}`}
              >
                <div className="text-accent mb-4">{feature.icon}</div>
                <h3 className="font-serif text-2xl md:text-3xl font-medium text-primary mb-4">
                  {feature.title}
                </h3>
                <p className="font-sans text-base text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section className="py-24 bg-muted" data-testid="projects-preview-section">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <p className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-4">
              Projelerimiz
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-primary">
              Öne Çıkan İşlerimiz
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {projects.map((project, index) => (
              <div key={index} className="project-card group" data-testid={`project-preview-${index}`}>
                <img src={project.image} alt="Kozsağ Group Proje" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/projeler" data-testid="view-all-projects-button">
              <button className="btn-primary hover-lift flex items-center gap-2 mx-auto">
                Tüm Projeleri Gör
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white" data-testid="cta-section">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            Projenizi Birlikte Gerçekleştirelim
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed mb-8 max-w-2xl mx-auto opacity-90">
            Hayalinizdeki taş evi inşa etmek için hemen iletişime geçin.
            Uzman ekibimiz size en iyi çözümleri sunmak için hazır.
          </p>
          <Link to="/iletisim" data-testid="cta-contact-button">
            <button className="btn-accent hover-lift">
              Teklif Alın
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;