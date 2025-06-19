import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { getTextByLanguage } from '../utils/textHelpers'
import { useEffect, useState } from 'react'

// --- Composant MobileDomainNav ---
const domainIds = ['domaine1', 'domaine5', 'domaine6', 'domaine2', 'domaine3', 'domaine4'];
const domainTitleIds = ['title-domaine1', 'title-domaine5', 'title-domaine6', 'title-domaine2', 'title-domaine3', 'title-domaine4'];
const domainTextKeys = [
  'mobile_nav_domaine1',
  'mobile_nav_domaine5',
  'mobile_nav_domaine6',
  'mobile_nav_domaine2',
  'mobile_nav_domaine3',
  'mobile_nav_domaine4',
];

function MobileDomainNav({ texts }) {
  const { language } = useLanguage();
  const DOMAINS = domainIds.map((id, idx) => ({
    id,
    titleId: domainTitleIds[idx],
    label: getTextByLanguage(`home.sectors.${domainTextKeys[idx]}`, language, ''),
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
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
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
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(key, language, defaultValue);

  const sectors = [
    {
      id: '01',
      name: getText('home.sectors.01.name'),
      icon: '🦠',
      color: 'bg-green-100 hover:bg-green-200',
      description: getText('home.sectors.01.description')
    },
    {
      id: '02',
      name: getText('home.sectors.02.name'),
      icon: '🏥',
      color: 'bg-blue-100 hover:bg-blue-200',
      description: getText('home.sectors.02.description')
    },
    {
      id: '03',
      name: getText('home.sectors.03.name'),
      icon: '🏠',
      color: 'bg-pink-100 hover:bg-pink-200',
      description: getText('home.sectors.03.description')
    },
    {
      id: '04',
      name: getText('home.sectors.04.name'),
      icon: '/assets/icons/football-field.svg',
      isSvg: true,
      color: 'bg-emerald-100 hover:bg-emerald-200',
      description: getText('home.sectors.04.description')
    },
    {
      id: '05',
      name: getText('home.sectors.05.name'),
      icon: '🍇',
      color: 'bg-purple-100 hover:bg-purple-200',
      description: getText('home.sectors.05.description')
    },
    {
      id: '06',
      name: getText('home.sectors.06.name'),
      icon: '🍎',
      color: 'bg-gray-100 hover:bg-gray-200',
      description: getText('home.sectors.06.description')
    },
    {
      id: '07',
      name: getText('home.sectors.07.name'),
      icon: '🦪',
      color: 'bg-indigo-100 hover:bg-indigo-200',
      description: getText('home.sectors.07.description')
    },
    {
      id: '08',
      name: getText('home.sectors.08.name'),
      icon: '🐔',
      color: 'bg-red-100 hover:bg-red-200',
      description: getText('home.sectors.08.description')
    },
    {
      id: '09',
      name: getText('home.sectors.09.name'),
      icon: '⛳',
      color: 'bg-emerald-100 hover:bg-emerald-200',
      description: getText('home.sectors.09.description')
    },
    {
      id: '10',
      name: getText('home.sectors.10.name'),
      icon: '🌳',
      color: 'bg-emerald-100 hover:bg-emerald-200',
      description: getText('home.sectors.10.description')
    }
  ];

  const problemSolvingCategories = [
    {
      id: 'health-public-category',
      heroCardKey: 'home.hero.card_title_health',
      imageSrc: '/images/sante_publique.webp',
      titleKey: 'home.sectors.category_health_hygiene_title',
      subdomains: [
        { textKey: 'home.sectors.subdomain_epidemiology', link: `/${language}/sectors/01` },
        { textKey: 'home.sectors.subdomain_13', link: `/${language}/sectors/13` },
      ],
    },
    {
      id: 'hygiene-interior-category',
      heroCardKey: 'home.hero.card_title_hygiene',
      imageSrc: '/images/hygiène.webp',
      titleKey: 'home.sectors.category_hygiene_title',
      subdomains: [
        { textKey: 'home.sectors.subdomain_hospital_hygiene', link: `/${language}/sectors/02` },
        { textKey: 'home.sectors.subdomain_indoor_hygiene', link: `/${language}/sectors/03` },
        { textKey: 'home.sectors.subdomain_11', link: `/${language}/sectors/11` },
      ],
    },
    {
      id: 'buildings-category',
      heroCardKey: 'home.hero.card_title_buildings',
      imageSrc: '/images/batiment_merule.webp',
      titleKey: 'home.sectors.category_buildings_title',
      subdomains: [
        { textKey: 'home.sectors.subdomain_12', link: `/${language}/sectors/12` },
      ],
    },
    {
      id: 'agriculture-livestock-category',
      heroCardKey: 'home.hero.card_title_agriculture',
      imageSrc: '/images/agriculture_elevage.webp',
      titleKey: 'home.sectors.category_agriculture_livestock_title',
      subdomains: [
        { textKey: 'home.sectors.subdomain_viticulture', link: `/${language}/sectors/05` },
        { textKey: 'home.sectors.subdomain_arboriculture', link: `/${language}/sectors/06` },
        { textKey: 'home.sectors.subdomain_poultry_farming', link: `/${language}/sectors/08` },
        { textKey: 'home.sectors.subdomain_shellfish_farming', link: `/${language}/sectors/07` },
      ],
    },
    {
      id: 'industrial-fermentation-category',
      heroCardKey: 'home.hero.card_title_industrial',
      imageSrc: '/images/industrie_bioenergie.webp',
      titleKey: 'home.sectors.category_industrial_fermentation_title',
      subdomains: [
        { textKey: 'home.sectors.subdomain_winemaking', link: `/${language}/sectors/05` },
        { textKey: 'home.sectors.subdomain_purification_systems', link: `/${language}/solutions/systemes-epuration` },
        { textKey: 'home.sectors.subdomain_methanizers', link: `/${language}/solutions/methaniseurs` },
      ],
    },
    {
      id: 'turf-parks-category',
      heroCardKey: 'home.hero.card_title_turf',
      imageSrc: '/images/gazons_pro_parcs_jardins.webp',
      titleKey: 'home.sectors.category_turf_parks_title',
      subdomains: [
        { textKey: 'home.sectors.subdomain_sports_turf', link: `/${language}/sectors/04` },
        { textKey: 'home.sectors.subdomain_golf_courses', link: `/${language}/sectors/09` },
        { textKey: 'home.sectors.subdomain_cemeteries', link: `/${language}/sectors/10` },
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
              {getText('home.hero.title')}
            </h2>
            <p className="text-2xl md:text-3xl mb-0 text-gray-100 max-w-2xl mx-auto">
              {getText('home.hero.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bandeau sticky mobile domaines */}
      <MobileDomainNav texts={getText('home.sectors')} />

      {/* New Problem Solving Categories Section - MODERN CARDS */}
      <section id="sectors-grid" className="py-20 bg-white dark:bg-gray-900 scroll-mt-[80px]">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary dark:text-white">
            {getText('home.sectors.title')}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:gap-12 lg:gap-16">
            {problemSolvingCategories.map((category, idx) => (
              <div 
                key={category.id} 
                id={domainIds[idx]} 
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden w-full md:w-2/3 ${idx % 2 === 0 ? 'md:ml-[10%]' : 'md:ml-auto md:mr-[10%]'}`}
              >
                {/* Titre au-dessus de l'image */}
                <div
                  className={`w-full bg-white dark:bg-gray-800 text-primary dark:text-secondary-light text-xl font-bold pt-4 pb-2 ${idx % 2 === 0 ? 'md:text-right md:pr-6 lg:pr-8' : 'md:text-left md:pl-6 lg:pl-8'}`}
                  id={domainTitleIds[idx]}
                >
                  {getText(category.titleKey)}
                </div>
                <div className={`w-16 h-1.5 bg-secondary mb-4 rounded-full ${idx % 2 === 0 ? 'md:ml-auto md:mr-6 lg:mr-8' : 'md:mr-auto md:ml-6 lg:ml-8'}`}></div>
                {/* Conteneur pour image et boutons côte à côte */}
                <div className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Conteneur Image */}
                  <div className="w-full md:w-1/2 relative">
                    <img
                      src={category.imageSrc}
                      alt={getText(category.titleKey)}
                      className="w-full h-auto md:h-full object-cover aspect-video md:aspect-auto"
                    />
                  </div>
                  {/* Conteneur Boutons */}
                  <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-center gap-y-3">
                    {category.subdomains.map((subdomain) => (
                      <Link
                        key={subdomain.textKey}
                        to={subdomain.link}
                        className="block bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-primary dark:text-white font-semibold px-4 py-2.5 rounded-md text-sm text-center transition-colors duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 border border-gray-300 dark:border-gray-600"
                      >
                        {getText(subdomain.textKey)}
                      </Link>
                    ))}
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
          <h2 className="text-4xl font-bold mb-8 text-white">{getText('home.cta.title')}</h2>
          <p className="text-xl mb-12 text-gray-100 max-w-2xl mx-auto">
            {getText('home.cta.subtitle')}
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            {getText('home.cta.button')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 