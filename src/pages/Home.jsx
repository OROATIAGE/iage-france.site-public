import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const Home = () => {
  const sectors = [
    {
      name: 'Agroalimentaire',
      icon: '🌾',
      color: 'bg-green-100 hover:bg-green-200',
      description: 'Analyses et contrôles pour l\'industrie agroalimentaire'
    },
    {
      name: 'Pharmaceutique',
      icon: '💊',
      color: 'bg-blue-100 hover:bg-blue-200',
      description: 'Solutions pour l\'industrie pharmaceutique'
    },
    {
      name: 'Cosmétique',
      icon: '💄',
      color: 'bg-pink-100 hover:bg-pink-200',
      description: 'Contrôles et analyses cosmétiques'
    },
    {
      name: 'Environnement',
      icon: '🌍',
      color: 'bg-emerald-100 hover:bg-emerald-200',
      description: 'Analyses environnementales'
    },
    {
      name: 'Chimie',
      icon: '🧪',
      color: 'bg-purple-100 hover:bg-purple-200',
      description: 'Analyses chimiques et contrôles'
    },
    {
      name: 'Métallurgie',
      icon: '⚙️',
      color: 'bg-gray-100 hover:bg-gray-200',
      description: 'Contrôles métallurgiques'
    },
    {
      name: 'Textile',
      icon: '🧵',
      color: 'bg-indigo-100 hover:bg-indigo-200',
      description: 'Analyses pour l\'industrie textile'
    },
    {
      name: 'Automobile',
      icon: '🚗',
      color: 'bg-red-100 hover:bg-red-200',
      description: 'Contrôles pour l\'industrie automobile'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Solutions d'analyse pour votre industrie
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Expertise, innovation et qualité au service de vos besoins
            </p>
            <Link
              to="/contact"
              className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Contactez-nous
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Analyses de laboratoire',
                description: 'Des analyses précises et fiables pour répondre à vos besoins spécifiques.',
                icon: '🔬',
              },
              {
                title: 'Conseil et expertise',
                description: 'Un accompagnement personnalisé pour optimiser vos processus.',
                icon: '💡',
              },
              {
                title: 'Formation',
                description: 'Des programmes de formation adaptés à vos équipes.',
                icon: '📚',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Domaines d'Expertise</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {sectors.map((sector, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <Link
                  to={`/sectors#${sector.name.toLowerCase()}`}
                  className={`${sector.color} w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg`}
                >
                  <span className="text-4xl mb-2">{sector.icon}</span>
                  <span className="text-sm font-semibold text-center">{sector.name}</span>
                </Link>
                <p className="mt-4 text-sm text-gray-600 text-center max-w-[200px]">
                  {sector.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer ?</h2>
          <p className="text-xl mb-8">
            Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous aider.
          </p>
          <Link
            to="/contact"
            className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Prendre contact
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 