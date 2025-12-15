const Projects = () => {
  const projects = [
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/eq3r10ut_1.jpeg',
      title: 'Modern Taş Villa - İzmir',
      description: 'Doğal taş ve ahşap detayların mükemmel uyumu',
      area: '350 m²',
      year: '2024',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/drf0lqug_2.jpeg',
      title: 'Taş Konut Kompleksi - Bodrum',
      description: 'Çağdaş mimari ve geleneksel taş işçiliği',
      area: '280 m²',
      year: '2023',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/1bchysas_3.jpeg',
      title: 'Lüks Villa - Çeşme',
      description: 'Havuz ve peyzaj düzenlemesi dahil tam proje',
      area: '450 m²',
      year: '2024',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/po3aigs4_5.jpeg',
      title: 'Taş Villa - Kuşadası',
      description: 'Ahşap çatı ve taş duvarlarla rustik şıklık',
      area: '320 m²',
      year: '2023',
    },
    {
      image: 'https://images.unsplash.com/photo-1548386704-23fc0135faab?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdG9uZSUyMHZpbGxhJTIwd2l0aCUyMHBvb2wlMjBzdW5zZXR8ZW58MHx8fHwxNzY1ODE2OTQzfDA&ixlib=rb-4.1.0&q=85',
      title: 'Prestij Taş Konut - Alaçatı',
      description: 'Deniz manzaralı lüks taş villa',
      area: '500 m²',
      year: '2024',
    },
    {
      image: 'https://images.unsplash.com/photo-1702432558737-86298f7f716a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBzdG9uZSUyMHZpbGxhJTIwd2l0aCUyMHBvb2wlMjBzdW5zZXR8ZW58MHx8fHwxNzY1ODE2OTQzfDA&ixlib=rb-4.1.0&q=85',
      title: 'Çağdaş Taş Ev - Urla',
      description: 'Minimalist tasarım ve doğal malzemeler',
      area: '380 m²',
      year: '2023',
    },
  ];

  return (
    <div className="projects-page" data-testid="projects-page">
      {/* Hero */}
      <section className="relative h-[50vh] overflow-hidden bg-primary" data-testid="projects-hero">
        <div className="absolute inset-0 noise-texture" />
        <div className="relative container mx-auto px-6 md:px-12 h-full flex items-center">
          <div className="max-w-3xl text-white">
            <h1 className="font-serif text-5xl md:text-7xl font-bold tracking-tight leading-none mb-6" data-testid="projects-title">
              Projelerimiz
            </h1>
            <p className="font-sans text-base md:text-lg leading-relaxed opacity-90">
              Her proje, mükemmellik ve kalite anlayışımızın bir yansımasıdır
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 bg-muted" data-testid="projects-grid">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden card-shadow transition-hover hover:shadow-lg group"
                data-testid={`project-card-${index}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-2xl font-medium text-primary mb-2">
                    {project.title}
                  </h3>
                  <p className="font-sans text-base text-muted mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex gap-4 font-sans text-sm text-accent font-medium">
                    <span>{project.area}</span>
                    <span>•</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white" data-testid="projects-cta">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-primary mb-6">
            Bir Sonraki Proje Sizinki Olsun
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed text-muted mb-8 max-w-2xl mx-auto">
            Hayalinizdeki taş evi birlikte tasarımlım. Uzman ekibimiz size özel çözümler sunmak için hazır.
          </p>
          <a href="/iletisim" data-testid="projects-cta-button">
            <button className="btn-accent hover-lift">
              İletişime Geçin
            </button>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Projects;