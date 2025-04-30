import { motion } from 'framer-motion';
import { texts } from '../content/texts'; // Import texts

// Helper function to safely get text from the nested structure
const getText = (key, defaultValue = '') => {
  const keys = key.split('.');
  let current = texts.legal; // Start search within the 'legal' section
  try {
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // console.warn(`Texte manquant pour legal.${key}`);
        return defaultValue;
      }
    }
    // Handle potential newlines stored as \n in the JSON
    return typeof current === 'string' ? current.replace(/\\n/g, '\n') : defaultValue;
  } catch (e) {
    // console.warn(`Erreur lors de la récupération de legal.${key}`);
    return defaultValue;
  }
};

function LegalNotice() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-12 md:py-16" // Added more padding
    >
      <h1 className="text-4xl font-bold mb-8">{getText('title', 'Mentions légales')}</h1>
      <div className="prose lg:prose-xl max-w-none dark:prose-invert space-y-6"> {/* Added space-y */}

        {/* Section 1: Éditeur du site */}
        <section>
          <h2>{getText('section1_title')}</h2>
          <p>{getText('section1_intro')}</p>
          <p>
            <strong>{getText('section1_company_name')}</strong><br />
            {getText('section1_company_details')}<br />
            <strong>Siège social :</strong> {getText('section1_address1')}<br />
            {/* Optional: Display Paris office if needed */}
            {/* <strong>Bureau Paris :</strong> {getText('section1_address2')}<br /> */}
            <strong>RCS :</strong> {getText('section1_rcs')}<br />
            <strong>N° TVA intracommunautaire :</strong> {getText('section1_vat')}<br />
          </p>
          <p>
            <strong>{getText('section1_director_intro')}</strong><br />
            {getText('section1_director_details')}
          </p>
          <p>
            <strong>{getText('section1_contact_intro')}</strong><br />
            <strong>Tél :</strong> {getText('section1_contact_phone')}<br />
            <strong>Email :</strong> <a href={`mailto:${getText('section1_contact_email')}`}>{getText('section1_contact_email')}</a>
          </p>
        </section>

        {/* Section 2: Hébergement */}
        <section>
          <h2>{getText('section2_title')}</h2>
          <p>{getText('section2_intro')}</p>
          <p>
            <strong>{getText('section2_host_name')}</strong><br />
            {getText('section2_host_address')}<br />
            <a href={getText('section2_host_site')} target="_blank" rel="noopener noreferrer">{getText('section2_host_site')}</a>
          </p>
        </section>

        {/* Section 3: Propriété intellectuelle */}
        <section>
          <h2>{getText('section3_title')}</h2>
          <p>{getText('section3_content1')}</p>
          <p>{getText('section3_content2')}</p>
        </section>

        {/* Section 4: Données personnelles */}
        <section>
          <h2>{getText('section4_title')}</h2>
          <p>{getText('section4_content1')}</p>
          <ul>
            <li><strong>Responsable du traitement :</strong> {getText('section4_responsible')}</li>
            <li><strong>Finalité :</strong> {getText('section4_purpose')}</li>
            <li><strong>Durée de conservation :</strong> {getText('section4_duration')}</li>
            <li><strong>Destinataire :</strong> {getText('section4_recipient')}</li>
          </ul>
          <p>{getText('section4_rights_intro')}</p>
          <p>
            <strong>{getText('section4_contact_name')}</strong><br />
            Email : <a href={`mailto:${getText('section4_contact_email')}`}>{getText('section4_contact_email')}</a><br />
            {getText('section4_contact_address')}
          </p>
          <p>
            {getText('section4_cnil')} <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">https://www.cnil.fr</a>
          </p>
        </section>

        {/* Section 5: Cookies */}
        <section>
          <h2>{getText('section5_title')}</h2>
          <p>{getText('section5_content1')}</p>
          <p>{getText('section5_content2')}</p>
          <p>{getText('section5_types_intro')}</p>
          <ul>
            <li>{getText('section5_type1')}</li>
            <li>{getText('section5_type2')}</li>
            {getText('section5_type3') && <li>{getText('section5_type3')}</li>} {/* Conditionally render if type3 exists */}
          </ul>
        </section>

        {/* Section 6: Responsabilités */}
        <section>
          <h2>{getText('section6_title')}</h2>
          <p>{getText('section6_content1')}</p>
          <p>{getText('section6_content2')}</p>
        </section>

      </div>
    </motion.div>
  );
}

export default LegalNotice; 