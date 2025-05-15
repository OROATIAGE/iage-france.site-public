import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { texts } from '../content/texts'
import { useEffect, useState } from 'react'

// --- Composant MobileDomainNav ---
const domainIds = ['domaine1', 'domaine2', 'domaine3', 'domaine4'];
const domainTitleIds = ['title-domaine1', 'title-domaine2', 'title-domaine3', 'title-domaine4'];
const domainTextKeys = [
  'mobile_nav_domaine1',
  'mobile_nav_domaine2',
  'mobile_nav_domaine3',
  'mobile_nav_domaine4',
];
function MobileDomainNav({ texts }) {
  const DOMAINS = domainIds.map((id, idx) => ({
    id,
    titleId: domainTitleIds[idx],
    label: texts[domainTextKeys[idx]] || '',
  }));
  const [active, setActive] = useState(DOMAINS[0].id);
  useEffect(() => {
    const handleScroll = () => {
      let found = DOMAINS[0].id;
      for (const domain of DOMAINS) {
        const el = document.getElementById(domain.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100) found = domain.id;
        }
      }
      setActive(found);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [DOMAINS]);
  const handleClick = (id, titleId) => {
    const el = document.getElementById(titleId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  return (
    <nav className="fixed top-16 left-0 right-0 z-30 bg-white shadow md:hidden flex overflow-x-auto border-b">
      {DOMAINS.map(domain => (
        <button
          key={domain.id}
          onClick={() => handleClick(domain.id, domain.titleId)}
          className={`flex-1 px-4 py-2 text-sm font-bold transition-colors
            ${active === domain.id ? 'text-primary border-b-2 border-primary bg-primary/10' : 'text-gray-500'}
          `}
        >
          {domain.label}
        </button>
      ))}
    </nav>
  );
}

const Home = () => {
  const sectors = [
    {
      id: '01',
      name: texts.home.sectors['01'].name,
      icon: '🦠',
      color: 'bg-green-100 hover:bg-green-200',
      description: texts.home.sectors['01'].description
    },
    {
      id: '02',
      name: texts.home.sectors['02'].name,
      icon: '🏥',
      color: 'bg-blue-100 hover:bg-blue-200',
      description: texts.home.sectors['02'].description
    },
    {
      id: '03',
      name: texts.home.sectors['03'].name,
      icon: '🏠',
      color: 'bg-pink-100 hover:bg-pink-200',
      description: texts.home.sectors['03'].description
    },
    {
      id: '04',
      name: texts.home.sectors['04'].name,
      icon: '/assets/icons/football-field.svg',
      isSvg: true,
      color: 'bg-emerald-100 hover:bg-emerald-200',
      description: texts.home.sectors['04'].description
    },
    {
      id: '05',
      name: texts.home.sectors['05'].name,
      icon: '🍇',
      color: 'bg-purple-100 hover:bg-purple-200',
      description: texts.home.sectors['05'].description
    },
    {
      id: '06',
      name: texts.home.sectors['06'].name,
      icon: '🍎',
      color: 'bg-gray-100 hover:bg-gray-200',
      description: texts.home.sectors['06'].description
    },
    {
      id: '07',
      name: texts.home.sectors['07'].name,
      icon: '🦪',
      color: 'bg-indigo-100 hover:bg-indigo-200',
      description: texts.home.sectors['07'].description
    },
    {
      id: '08',
      name: texts.home.sectors['08'].name,
      icon: '🐔',
      color: 'bg-red-100 hover:bg-red-200',
      description: texts.home.sectors['08'].description
    }
  ]

  const problemSolvingCategories = [
    {
      id: 'health-hygiene-category',
      heroCardKey: 'card_title_health',
      imageSrc: '/images/hygiene-sante-publique.webp',
      titleKey: 'category_health_hygiene_title',
      subdomains: [
        { textKey: 'subdomain_epidemiology', link: '/sectors/01' },
        { textKey: 'subdomain_hospital_hygiene', link: '/sectors/02' },
        { textKey: 'subdomain_indoor_hygiene', link: '/sectors/03' },
      ],
    },
    {
      id: 'agriculture-livestock-category',
      heroCardKey: 'card_title_agriculture',
      imageSrc: '/images/agriculture_elevage.webp',
      titleKey: 'category_agriculture_livestock_title',
      subdomains: [
        { textKey: 'subdomain_viticulture', link: '/sectors/05' },
        { textKey: 'subdomain_arboriculture', link: '/sectors/06' },
        { textKey: 'subdomain_poultry_farming', link: '/sectors/08' },
        { textKey: 'subdomain_shellfish_farming', link: '/sectors/07' },
      ],
    },
    {
      id: 'industrial-fermentation-category',
      heroCardKey: 'card_title_industrial',
      imageSrc: '/images/industrie_bioenergie.webp',
      titleKey: 'category_industrial_fermentation_title',
      subdomains: [
        { textKey: 'subdomain_winemaking', link: '/sectors/05' },
        { textKey: 'subdomain_purification_systems', link: '/solutions/systemes-epuration' },
        { textKey: 'subdomain_methanizers', link: '/solutions/methaniseurs' },
      ],
    },
    {
      id: 'turf-parks-category',
      heroCardKey: 'card_title_turf',
      imageSrc: '/images/gazons_pro_parcs_jardins.webp',
      titleKey: 'category_turf_parks_title',
      subdomains: [
        { textKey: 'subdomain_sports_turf', link: '/sectors/04' },
        { textKey: 'subdomain_golf_courses', link: '/sectors/04' },
        { textKey: 'subdomain_cemeteries', link: '/sectors/04' },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary">
        <div className="container flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full text-center text-white py-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white max-w-4xl mx-auto leading-tight">
              {texts.home.hero.title}
            </h2>
            <p className="text-2xl md:text-3xl mb-0 text-gray-100 max-w-2xl mx-auto">
              {texts.home.hero.subtitle}
            </p>
          </motion.div>
        </div>
      </section>
      {/* Bandeau sticky mobile domaines */}
      <MobileDomainNav texts={texts.home.sectors} />
      {/* New Problem Solving Categories Section - MODERN CARDS */}
      <section id="sectors-grid" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20 md:scroll-mt-24">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary dark:text-white">
            {texts.home.sectors.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {problemSolvingCategories.map((category, idx) => (
              <div key={category.id} id={domainIds[idx]} className="bg-white rounded-xl shadow-lg flex flex-col items-center overflow-hidden">
                {/* Titre au-dessus de l'image */}
                <div
                  className="w-full bg-primary text-white text-lg font-bold text-center py-3 rounded-t-xl"
                  id={domainTitleIds[idx]}
                >
                  {texts.home.sectors[category.titleKey]}
                </div>
                {/* Image + boutons overlay sur l'image */}
                <div className="relative w-full">
                  <img
                    src={category.imageSrc}
                    alt={texts.home.sectors[category.titleKey]}
                    className="w-full aspect-[16/9] object-cover"
                  />
                  {/* Overlay dégradé en bas de l'image pour lisibilité (desktop uniquement) */}
                  <div className="hidden md:block absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-0 rounded-b-xl pointer-events-none" />
                  {/* Overlays : sous l'image sur mobile, sur l'image en absolute sur desktop */}
                  <div
                    className="flex flex-col gap-5 w-full mt-2 md:absolute md:left-0 md:right-0 md:bottom-8 md:p-4 md:py-2 md:z-10 md:pointer-events-auto md:mt-0"
                  >
                    {category.subdomains.map((subdomain, idx2) => {
                      const mlClasses = [
                        'md:ml-0',
                        'md:ml-8',
                        'md:ml-16',
                        'md:ml-24',
                        'md:ml-32',
                      ];
                      return (
                        <Link
                          key={subdomain.textKey}
                          to={subdomain.link}
                          className={`
                            bg-white/40 md:bg-white/60 backdrop-blur-sm text-primary font-bold px-3 py-1 rounded-full text-sm whitespace-normal break-words shadow transition-all duration-150
                            w-full mx-auto
                            md:w-2/3 ${mlClasses[idx2] || ''}
                            cursor-pointer
                            focus:bg-white focus:shadow-2xl focus:ring-4 focus:ring-primary/50 focus:-translate-y-0.5 focus:outline-none
                            md:hover:bg-white md:hover:shadow-2xl md:hover:ring-4 md:hover:ring-primary/50 md:hover:-translate-y-0.5
                          `}
                        >
                          {texts.home.sectors[subdomain.textKey]}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-8 text-white">{texts.home.cta.title}</h2>
          <p className="text-xl mb-12 text-gray-100 max-w-2xl mx-auto">
            {texts.home.cta.subtitle}
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            {texts.home.cta.button}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 