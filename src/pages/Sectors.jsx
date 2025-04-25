import { motion } from 'framer-motion';

function Sectors() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">Nos Secteurs d'Activité</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sectors content will go here */}
      </div>
    </motion.div>
  );
}

export default Sectors; 