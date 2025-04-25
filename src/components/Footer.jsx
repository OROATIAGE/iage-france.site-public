import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="mb-2">IAGE</p>
            <p className="mb-2">Adresse</p>
            <p className="mb-2">Téléphone: +33 X XX XX XX XX</p>
            <p className="mb-2">Email: contact@iage-france.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="hover:text-primary transition-colors">
                  Nos Services
                </Link>
              </li>
              <li>
                <Link to="/sectors" className="hover:text-primary transition-colors">
                  Secteurs d'activité
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Légal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/mentions-legales" className="hover:text-primary transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-confidentialite" className="hover:text-primary transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="hover:text-primary transition-colors">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} IAGE. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 