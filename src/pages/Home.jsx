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
        <div className="container min-h-[70vh] flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full text-center text-white py-20"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white max-w-4xl mx-auto leading-tight">
              {texts.home.hero.title}
            </h2>
            <p className="text-2xl md:text-3xl mb-12 text-gray-100 max-w-2xl mx-auto">
              {texts.home.hero.subtitle}
            </p>
            <div className="mt-10">
              <p className="text-4xl md:text-5xl mb-6 text-white font-semibold">
                {texts.home.hero.professional_intro}
              </p>
              <div className="flex flex-wrap justify-center items-stretch gap-6">
                {problemSolvingCategories.map(category => (
                  <Link
                    key={category.id}
                    to={`/#${category.id}`}
                    className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 w-64 flex flex-col overflow-hidden"
                    onClick={(e) => {
                      const element = document.getElementById(category.id);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                  >
                    <img 
                      src={category.imageSrc} 
                      alt={(texts.home.hero[category.heroCardKey] || '').replace(/\\n/g, '\n')} 
                      className="h-40 w-full object-cover rounded-t-lg"
                    />
                    <div className="bg-primary text-white p-3 w-full text-center rounded-b-lg flex-grow flex items-center justify-center">
                      <span className="font-semibold text-sm whitespace-pre-line">{(texts.home.hero[category.heroCardKey] || '').replace(/\\n/g, '\n')}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Problem Solving Categories Section */}
      <section id="sectors-grid" className="py-20 bg-white dark:bg-gray-900 scroll-mt-20 md:scroll-mt-24">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-primary dark:text-white">
            {texts.home.sectors.title} {/* Nous répondons à vos questions */}
          </h2>
          <div className="space-y-16">
            {problemSolvingCategories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-20 md:scroll-mt-24">
                <h3 className="text-3xl font-semibold text-primary dark:text-secondary mb-8 border-b-2 border-primary/30 dark:border-secondary/30 pb-3">
                  {texts.home.sectors[category.titleKey]}
                </h3>
                <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                  {category.subdomains.map((subdomain) => (
                    <Link
                      key={subdomain.textKey}
                      to={subdomain.link}
                      className="bg-secondary/10 hover:bg-secondary/20 dark:bg-secondary/20 dark:hover:bg-secondary/30 text-secondary dark:text-secondary-light px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      {texts.home.sectors[subdomain.textKey]}
                    </Link>
                  ))}
                </div>
              </section>
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