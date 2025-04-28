import { motion } from 'framer-motion';
import { texts } from '../content/texts'; // Import des textes

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">{texts.about.title}</h1>
      <div className="prose lg:prose-xl max-w-none">
        {/* About us content will go here */}
        <p>
          Informations sur IAGE à ajouter ici...
        </p>
      </div>
    </motion.div>
  );
}

export default About; 