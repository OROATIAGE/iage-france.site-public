import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { texts } from '../content/texts'

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
        { textKey: 'subdomain_shellfish_farming', link: '/sectors/07' },
        { textKey: 'subdomain_poultry_farming', link: '/sectors/08' },
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

      {/* New Problem Solving Categories Section - MODERN CARDS */}
      <section id="sectors-grid" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20 md:scroll-mt-24">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary dark:text-white">
            {texts.home.sectors.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {problemSolvingCategories.map(category => (
              <div key={category.id} className="bg-white rounded-xl shadow-lg flex flex-col items-center overflow-hidden">
                {/* Titre au-dessus de l'image */}
                <div className="w-full bg-primary text-white text-lg font-bold text-center py-3 rounded-t-xl">
                  {texts.home.sectors[category.titleKey]}
                </div>
                {/* Image + boutons overlay sur l'image */}
                <div className="relative w-full">
                  <img
                    src={category.imageSrc}
                    alt={texts.home.sectors[category.titleKey]}
                    className="w-full aspect-[16/9] object-cover"
                  />
                  {/* Overlay dégradé en bas de l'image pour lisibilité */}
                  <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-0 rounded-b-xl pointer-events-none" />
                  <div
                    className={`absolute left-0 right-0 bottom-8 flex flex-col p-4 py-2 z-10 pointer-events-auto ${
                      category.subdomains.length === 3 ? 'gap-12' : 'gap-5'
                    }`}
                  >
                    {category.subdomains.map((subdomain, idx, arr) => {
                      const n = arr.length;
                      let style = { width: '66%' };
                      if (idx === 0) style.marginLeft = 0;
                      else {
                        const interval = (n - 1) * 2;
                        style.marginLeft = `${(idx * 65) / interval}%`;
                      }
                      return (
                        <Link
                          key={subdomain.textKey}
                          to={subdomain.link}
                          className="bg-white/60 backdrop-blur-sm text-primary font-bold px-3 py-1 rounded-full text-sm whitespace-normal break-words shadow transition-all duration-150 hover:bg-white hover:shadow-2xl hover:ring-4 hover:ring-primary/50 hover:-translate-y-0.5 cursor-pointer focus:bg-white focus:shadow-2xl focus:ring-4 focus:ring-primary/50 focus:-translate-y-0.5 focus:outline-none"
                          style={style}
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