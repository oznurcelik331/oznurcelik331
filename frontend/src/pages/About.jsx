import { CheckCircle } from 'lucide-react';

const About = () => {
  const values = [
    'İkamet amaçlı binalarda uzmanlaşmış kadro',
    'Taş ev mimarisi ve modern villa projelerinde tecrübe',
    'Şeffaf ve sözleşmeye bağlı proje yönetimi',
    'Temelden çatıya titiz işçilik',
    'Doğayla uyumlu ve uzun ömürlü yaşam alanları',
  ];

  const stats = [
    { number: '20+', label: 'YILLIK DENEYİM' },
    { number: '150+', label: 'TAMAMLANAN PROJE' },
    { number: '300+', label: 'MUTLU MÜŞTERİ' },
    { number: '50K+', label: 'm² İNŞAAT ALANI' },
  ];

  return (
    <div className="about-page" data-testid="about-page">
      {/* Hero */}
      <section className="relative py-32 md:py-40 bg-primary" data-testid="about-hero">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-8">
            HİKAYEMİZ
          </p>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-[0.9] text-white" data-testid="about-title">
            Hakkımızda
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-32 md:py-40 bg-white" data-testid="about-story">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-8">
                FİLOZOFİMİZ
              </p>
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-primary mb-12">
                Estetik ve Güvenin<br />Taş ve Modern Yapılardaki Yüzü
              </h2>
              <div className="space-y-6 text-base md:text-lg font-sans text-muted leading-relaxed">
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
                src="https://customer-assets.emergentagent.com/job_insaatech/artifacts/ssaegecb_16.jpeg"
                alt="Kozsağ Group İnşaat"
                className="w-full h-[600px] object-cover card-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32 md:py-40 bg-muted" data-testid="about-values">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-8">
                DEĞERLERİMİZ
              </p>
              <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-primary">
                Neye İnanıyoruz
              </h2>
            </div>
            <div className="space-y-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-start gap-6 bg-white p-8 card-shadow transition-smooth hover:shadow-lg"
                  data-testid={`value-item-${index}`}
                >
                  <CheckCircle className="text-accent flex-shrink-0 mt-1" size={28} strokeWidth={1.5} />
                  <p className="text-base md:text-lg font-sans text-primary leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-32 md:py-40 bg-primary text-white" data-testid="about-stats">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            {stats.map((stat, index) => (
              <div key={index} data-testid={`stat-${index}`}>
                <div className="text-6xl md:text-7xl font-serif font-bold mb-4">{stat.number}</div>
                <div className="text-xs font-sans uppercase tracking-[0.2em] opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;