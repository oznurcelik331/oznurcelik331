import { CheckCircle } from 'lucide-react';

const About = () => {
  const values = [
    'İkamet amaçlı binalarda uzmanlaşmış kadro',
    'Taş ev mimarisi ve modern villa projelerinde tecrübe',
    'Şeffaf ve sözleşmeye bağlı proje yönetimi',
    'Temelden çatıya titiz işçilik',
    'Doğayla uyumlu ve uzun ömürlü yaşam alanları',
  ];

  return (
    <div className="about-page" data-testid="about-page">
      {/* Hero */}
      <section className="relative h-[60vh] overflow-hidden" data-testid="about-hero">
        <img
          src="https://images.pexels.com/photos/7937709/pexels-photo-7937709.jpeg"
          alt="Hakkımızda"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative container mx-auto px-6 md:px-12 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6" data-testid="about-title">
              Hakkımızda
            </h1>
            <p className="font-sans text-base md:text-lg leading-relaxed opacity-90">
              Nesiller boyu devam edecek yapılar inşa ediyoruz
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white" data-testid="about-story">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-4">
                Hikayemiz
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-primary mb-6">
                Estetik ve Güvenin<br />Taş ve Modern Yapılardaki Yüzü
              </h2>
              <div className="space-y-4 font-sans text-base text-muted leading-relaxed">
                <p>
                  KOZSAĞ GROUP İNŞAAT; ikamet amaçlı binaların inşaatında uzmanlaşmış, bölgenin güvenilir çözüm ortağıdır. 
                  Özellikle taş ev mimarisi ve modern villa projelerinde, temelden çatıya kadar titiz bir işçilik sergiliyoruz.
                </p>
                <p>
                  Mustafa Kozak ve Tahir Sağa liderliğindeki ekibimiz, proje planlamadan saha yönetimine, 
                  malzeme seçiminden anahtar teslimine kadar tüm süreçleri şeffaf ve sözleşmeye bağlı şekilde yönetir. 
                  Amacımız sadece bina yapmak değil, doğayla uyumlu ve uzun ömürlü yaşam alanları kurmaktır.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/td5or4px_4.jpeg"
                alt="Taş Detay"
                className="w-full h-[500px] object-cover card-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted" data-testid="about-values">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="font-sans text-sm uppercase tracking-widest text-accent font-bold mb-4">
                Değerlerimiz
              </p>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-primary">
                Neye İnanıyoruz
              </h2>
            </div>
            <div className="space-y-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-6 card-shadow transition-hover hover:shadow-lg"
                  data-testid={`value-item-${index}`}
                >
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={24} />
                  <p className="font-sans text-base md:text-lg text-primary">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-primary text-white" data-testid="about-stats">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div data-testid="stat-years">
              <div className="font-serif text-5xl font-bold mb-2">20+</div>
              <div className="font-sans text-sm uppercase tracking-widest opacity-80">Yıllık Deneyim</div>
            </div>
            <div data-testid="stat-projects">
              <div className="font-serif text-5xl font-bold mb-2">150+</div>
              <div className="font-sans text-sm uppercase tracking-widest opacity-80">Tamamlanan Proje</div>
            </div>
            <div data-testid="stat-clients">
              <div className="font-serif text-5xl font-bold mb-2">300+</div>
              <div className="font-sans text-sm uppercase tracking-widest opacity-80">Mutlu Müşteri</div>
            </div>
            <div data-testid="stat-area">
              <div className="font-serif text-5xl font-bold mb-2">50K+</div>
              <div className="font-sans text-sm uppercase tracking-widest opacity-80">m² İnşaat Alanı</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;