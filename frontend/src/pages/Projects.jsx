const Projects = () => {
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
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/td5or4px_4.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/po3aigs4_5.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/ikfxog8t_6.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/l6c0m3i6_7.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/293dd07n_8.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/fw4ua0ox_9.jpeg',
    },
    {
      image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/bsh2npvc_10.jpeg',
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
                    alt="Kozsağ Group Taş Ev Projesi"
                    className="w-full h-full object-cover transition-smooth group-hover:scale-105"
                  />
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