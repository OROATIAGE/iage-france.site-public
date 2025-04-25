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
      <section className="relative bg-gradient-to-r from-primary to-secondary">
        <div className="container min-h-[70vh] flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full text-center text-white py-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white max-w-4xl mx-auto leading-tight">
              Solutions d'analyse pour votre industrie
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-2xl mx-auto">
              Expertise, innovation et qualité au service de vos besoins
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Contactez-nous
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-16">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
          <h2 className="text-4xl font-bold text-center mb-16">Nos Domaines d'Expertise</h2>
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
          <h2 className="text-4xl font-bold mb-8 text-white">Prêt à commencer ?</h2>
          <p className="text-xl mb-12 text-gray-100 max-w-2xl mx-auto">
            Contactez-nous pour discuter de vos besoins et découvrir comment nous pouvons vous aider.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-primary font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            Prendre contact
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 