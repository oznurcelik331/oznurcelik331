const Projects = () => {
  const projects = [
    { image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/eq3r10ut_1.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/drf0lqug_2.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/1bchysas_3.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/td5or4px_4.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_c56545f5-d40a-4050-af6e-e70f33d426ef/artifacts/po3aigs4_5.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/ikfxog8t_6.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/l6c0m3i6_7.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/293dd07n_8.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/fw4ua0ox_9.jpeg' },
    { image: 'https://customer-assets.emergentagent.com/job_insaatech/artifacts/bsh2npvc_10.jpeg' },
  ];

  return (
    <div className="projects-page" data-testid="projects-page">
      {/* Hero */}
      <section className="relative py-32 md:py-40 bg-primary" data-testid="projects-hero">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-accent font-bold mb-8">
            PORTFOLYO
          </p>
          <h1 className="text-6xl md:text-8xl font-serif tracking-tight leading-[0.9] text-white mb-8" data-testid="projects-title">
            Tamamlanan<br />Projeler
          </h1>
          <p className="text-base md:text-lg font-sans leading-relaxed text-white/80 max-w-2xl mx-auto">
            Her proje, mükemmellik ve kalite anlayışımızın bir yansımasıdır
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-32 md:py-40 bg-muted" data-testid="projects-grid">
        <div className="container mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="project-card"
                data-testid={`project-card-${index}`}
              >
                <img
                  src={project.image}
                  alt="KOZSAĞ GROUP Tamamlanmış Proje"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 md:py-40 bg-white" data-testid="projects-cta">
        <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
          <h2 className="text-4xl md:text-6xl font-serif tracking-tight text-primary mb-8">
            Bir Sonraki Proje Sizinki Olsun
          </h2>
          <p className="text-base md:text-lg font-sans leading-relaxed text-muted mb-12 max-w-2xl mx-auto">
            Hayalinizdeki taş evi birlikte tasarlayalım.
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
