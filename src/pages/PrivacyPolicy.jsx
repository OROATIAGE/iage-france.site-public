import { motion } from 'framer-motion';
import { texts } from '../content/texts'; // Import texts

function PrivacyPolicy() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Use dynamic title */}
      <h1 className="text-4xl font-bold mb-8">{texts.privacy?.title || 'Politique de confidentialité'}</h1>
      <div className="prose lg:prose-xl max-w-none dark:prose-invert">
        {/* Use dynamic content, handle potential newlines */}
        <p className="whitespace-pre-line">
          {texts.privacy?.content || 'Contenu à ajouter...'}
        </p>
        {/* Add more paragraphs or sections as needed, potentially using more keys */}
      </div>
    </motion.div>
  );
}

export default PrivacyPolicy; 