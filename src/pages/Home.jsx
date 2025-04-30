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

  const servicesPreview = [
      {
        title: texts.home.services[0].title,
        description: texts.home.services[0].description,
        icon: '🔬',
      },
      {
        title: texts.home.services[1].title,
        description: texts.home.services[1].description,
        icon: '💡',
      },
      {
        title: texts.home.services[2].title,
        description: texts.home.services[2].description,
        icon: '🛠️',
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
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white max-w-4xl mx-auto leading-tight">
              {texts.home.hero.title}
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-2xl mx-auto">
              {texts.home.hero.subtitle}
            </p>
            <Link
              to="/#sectors-grid"
              className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
              onClick={(e) => {
                const element = document.getElementById('sectors-grid');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              {texts.home.sectors.title}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">{texts.home.services.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { service: servicesPreview[0], linkTo: '/services#category-analyses' },
              { service: servicesPreview[1], linkTo: '/services#category-diagbox-conseil' },
              { service: servicesPreview[2], linkTo: '/services#category-equipements' },
            ].map(({ service, linkTo }, index) => (
              <Link key={index} to={linkTo} className="group block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-xl shadow-lg p-8 h-full group-hover:shadow-xl group-hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="text-5xl mb-6">{service.icon}</div>
                  <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                  <p className="text-gray-600 text-lg">{service.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Grid - Reverted scroll-mt */}
      <section id="sectors-grid" className="py-20 bg-white dark:bg-gray-900 scroll-mt-24">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">{texts.home.sectors.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {sectors.map((sector, index) => (
              <Link key={sector.id} to={`/sectors/${sector.id}`} className="flex flex-col items-center group">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className={`${sector.color} w-36 h-36 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center p-4 transition-all duration-300 transform group-hover:scale-110 shadow-lg`}>
                    {sector.isSvg ? (
                      <img src={sector.icon} alt={sector.name} className="w-20 h-20 object-contain" />
                    ) : (
                      <span className="text-5xl mb-2">{sector.icon}</span>
                    )}
                    <span className="text-base font-semibold text-center mt-2 text-gray-800 dark:text-gray-200">{sector.name}</span>
                  </div>
                  <p className="mt-6 text-gray-600 dark:text-gray-400 text-center max-w-[200px] whitespace-pre-line">
                    {sector.description}
                  </p>
                </motion.div>
              </Link>
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