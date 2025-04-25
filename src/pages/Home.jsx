import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { texts } from '../content/texts'

const Home = () => {
  const sectors = [
    {
      name: texts.home.sectors.agroalimentaire.name,
      icon: '🌾',
      color: 'bg-green-100 hover:bg-green-200',
      description: texts.home.sectors.agroalimentaire.description
    },
    {
      name: texts.home.sectors.pharmaceutique.name,
      icon: '💊',
      color: 'bg-blue-100 hover:bg-blue-200',
      description: texts.home.sectors.pharmaceutique.description
    },
    {
      name: texts.home.sectors.cosmetique.name,
      icon: '💄',
      color: 'bg-pink-100 hover:bg-pink-200',
      description: texts.home.sectors.cosmetique.description
    },
    {
      name: texts.home.sectors.environnement.name,
      icon: '🌍',
      color: 'bg-emerald-100 hover:bg-emerald-200',
      description: texts.home.sectors.environnement.description
    },
    {
      name: texts.home.sectors.chimie.name,
      icon: '🧪',
      color: 'bg-purple-100 hover:bg-purple-200',
      description: texts.home.sectors.chimie.description
    },
    {
      name: texts.home.sectors.metallurgie.name,
      icon: '⚙️',
      color: 'bg-gray-100 hover:bg-gray-200',
      description: texts.home.sectors.metallurgie.description
    },
    {
      name: texts.home.sectors.textile.name,
      icon: '🧵',
      color: 'bg-indigo-100 hover:bg-indigo-200',
      description: texts.home.sectors.textile.description
    },
    {
      name: texts.home.sectors.automobile.name,
      icon: '🚗',
      color: 'bg-red-100 hover:bg-red-200',
      description: texts.home.sectors.automobile.description
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
        icon: '📚',
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
              to="/contact"
              className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              {texts.home.hero.cta}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">{texts.home.services.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {servicesPreview.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="text-5xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600 text-lg">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-20 bg-white">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">{texts.home.sectors.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`${sector.color} w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg`}>
                  <span className="text-4xl mb-2">{sector.icon}</span>
                  <span className="text-sm font-semibold text-center">{sector.name}</span>
                </div>
                <p className="mt-6 text-gray-600 text-center max-w-[200px]">
                  {sector.description}
                </p>
              </motion.div>
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