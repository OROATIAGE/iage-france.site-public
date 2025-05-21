import { useState, useRef, Fragment } from 'react'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { texts } from '../content/texts'
import { useLanguage } from '../context/LanguageContext'
import { getTextByLanguage } from '../utils/textHelpers'
import { Link } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ReCAPTCHA from 'react-google-recaptcha'
import PrivacyPolicyModal from '../components/PrivacyPolicyModal'

// Fix for Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Structure des secteurs (comme dans Home.jsx)
const sectors = [
  {
    category: 'category_health_hygiene_title',
    subdomains: [
      'subdomain_epidemiology',
      'subdomain_hospital_hygiene',
      'subdomain_indoor_hygiene',
    ],
  },
  {
    category: 'category_agriculture_livestock_title',
    subdomains: [
      'subdomain_viticulture',
      'subdomain_arboriculture',
      'subdomain_poultry_farming',
      'subdomain_shellfish_farming',
    ],
  },
  {
    category: 'category_industrial_fermentation_title',
    subdomains: [
      'subdomain_winemaking',
      'subdomain_purification_systems',
      'subdomain_methanizers',
    ],
  },
  {
    category: 'category_turf_parks_title',
    subdomains: [
      'subdomain_sports_turf',
      'subdomain_golf_courses',
      'subdomain_cemeteries',
    ],
  },
];

// Structure des services (comme dans le header)
const services = [
  { id: 'diagbox', name: 'DiagBox®' },
  { id: 'specific-combinations', name: 'Combinaisons spécifiques' },
  { id: 'development', name: 'Développement' },
  { id: 'sampling-advice', name: 'Conseil prélèvement' },
  { id: 'mobile-viz', name: 'Visualisation mobile' },
  { id: 'modeling', name: 'Modélisation' },
  { id: 'sampling-tools', name: 'Outils de prélèvement' },
  { id: 'local-labs', name: 'Laboratoires locaux' },
  { id: 'question', name: 'Simplement poser une question' }
];

const Contact = () => {
  const { language } = useLanguage();
  const getText = (key, defaultValue = '') => getTextByLanguage(key, language, defaultValue);
  const recaptchaRef = useRef(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [isPrivacyPolicyOpen, setIsPrivacyPolicyOpen] = useState(false);

  const [formData, setFormData] = useState({
    sector: '',
    service: '',
    lastName: '',
    firstName: '',
    jobTitle: '',
    company: '',
    email: '',
    phone: '',
    phoneCountry: 'fr',
    contactPreference: '',
    preferredDate: '',
    preferredTime: '',
    message: '',
    gdprConsent: false,
    honeypot: '',
    country: 'France',
    street: '',
    postalCode: '',
    city: '',
  })

  const contactPreferences = [
    { id: 'email', name: 'Email' },
    { id: 'phone', name: 'Appel téléphonique' },
    { id: 'video', name: 'Visio-conférence' }
  ];

  const needsTimeSlot = (preference) => {
    return ['phone', 'video'].includes(preference);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'contactPreference' && !needsTimeSlot(value) && { preferredTime: '' }),
    }))

    // Auto-complétion de la ville pour la France
    if (name === 'postalCode' && formData.country === 'France' && value.length === 5) {
      setIsLoadingCity(true);
      fetch(`https://api-adresse.data.gouv.fr/search/?q=${value}&type=municipality&limit=1`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            setFormData(prev => ({
              ...prev,
              city: data.features[0].properties.city
            }))
          }
        })
        .catch(error => console.error('Erreur lors de la récupération de la ville:', error))
        .finally(() => setIsLoadingCity(false))
    }
  }

  // Nouveau gestionnaire pour le champ téléphone
  const handlePhoneChange = (value, country) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
      phoneCountry: country.countryCode
    }))
  }

  // Validation du formulaire
  const validateForm = () => {
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert(getText('contact.form.invalid_email', 'Format d\'email invalide'));
      return false;
    }

    // Validation du numéro de téléphone
    if (formData.phone && !/^\+?[\d\s-]{8,}$/.test(formData.phone)) {
      alert(getText('contact.form.invalid_phone', 'Format de téléphone invalide'));
      return false;
    }

    // Vérification des champs requis
    const requiredFields = ['lastName', 'firstName', 'email', 'company', 'message'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(getText('contact.form.required_fields', 'Veuillez remplir tous les champs obligatoires'));
        return false;
      }
    }

    // Vérification de la longueur du message
    if (formData.message.length < 10) {
      alert(getText('contact.form.message_too_short', 'Le message est trop court'));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.gdprConsent) {
      alert(getText('contact.form.gdpr_required', 'Veuillez accepter la politique de confidentialité pour continuer.'))
      return;
    }

    // Vérifier le honeypot
    if (formData.honeypot) {
      console.log('Bot detected');
      return;
    }

    try {
      // Vérifier reCAPTCHA
      const recaptchaValue = await recaptchaRef.current.executeAsync();
      if (!recaptchaValue) {
        throw new Error('reCAPTCHA verification failed');
      }

      // Format the data for submission
      const formattedData = {
        ...formData,
        sector: formData.sector ? getText(`home.sectors.${formData.sector}`) : 'Non spécifié',
        service: formData.service ? getText(`services.nav.${formData.service}`, formData.service) : 'Non spécifié',
        contactPreference: formData.contactPreference ? getText(`contact.form.preference.${formData.contactPreference}`, formData.contactPreference) : 'Non spécifié',
        preferredDate: formData.preferredDate ? formData.preferredDate.split('T')[0] : '',
        preferredTime: formData.preferredTime ? getText(`contact.form.time.${formData.preferredTime}`, formData.preferredTime) : '',
        language: language,
        'g-recaptcha-response': recaptchaValue
      };

      // Supprimer le champ honeypot avant l'envoi
      delete formattedData.honeypot;

      // Send to GetForm
      const response = await fetch('https://getform.io/f/bxoyjpoa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Reset form and reCAPTCHA
      setFormData({
        sector: '',
        service: '',
        lastName: '',
        firstName: '',
        jobTitle: '',
        company: '',
        email: '',
        phone: '',
        phoneCountry: 'fr',
        contactPreference: '',
        preferredDate: '',
        preferredTime: '',
        message: '',
        gdprConsent: false,
        honeypot: '',
        country: 'France',
        street: '',
        postalCode: '',
        city: '',
      });
      recaptchaRef.current.reset();

      // Show success message
      alert(getText('contact.form.success', 'Votre message a été envoyé avec succès. Nous vous contacterons bientôt.'));

    } catch (error) {
      console.error('Error submitting form:', error);
      alert(getText('contact.form.error', 'Une erreur est survenue lors de l\'envoi du formulaire. Veuillez réessayer.'));
      // Reset reCAPTCHA en cas d'erreur
      recaptchaRef.current.reset();
    }
  };

  // Liste des pays (les plus courants en premier)
  const countries = [
    'France',
    'Belgique',
    'Suisse',
    'Luxembourg',
    'Allemagne',
    'Espagne',
    'Italie',
    'Royaume-Uni',
    'Pays-Bas',
    'Portugal',
    // Ajoutez d'autres pays si nécessaire
  ].sort((a, b) => a === 'France' ? -1 : b === 'France' ? 1 : a.localeCompare(b));

  // Coordonnées de IAGE à Montpellier
  const iageLocation = {
    lat: 43.6167,
    lng: 3.8833,
    address: "335 rue Louis Lépine – 34000 Montpellier"
  };

  // Centre de la France pour la vue initiale
  const franceCenter = {
    lat: 46.603354,
    lng: 1.888334
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8">{getText('contact.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Secteur d'intérêt */}
            <div>
              <label htmlFor="sector" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.sector', 'Secteur d\'intérêt')} <span className="text-red-500">*</span>
              </label>
              <select
                id="sector"
                name="sector"
                required
                value={formData.sector}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              >
                <option value="">{getText('contact.form.select_sector', 'Sélectionnez un secteur')}</option>
                <option value="general_interest" className="font-semibold">
                  {getText('contact.form.general_interest')}
                </option>
                {sectors.map((category) => (
                  <Fragment key={category.category}>
                    <option value={category.category} className="font-semibold bg-gray-100 dark:bg-gray-600">
                      {getText(`home.sectors.${category.category}`)}
                    </option>
                    {category.subdomains.map((subdomain) => (
                      <option key={subdomain} value={subdomain} className="pl-4">
                        {getText(`home.sectors.${subdomain}`)}
                      </option>
                    ))}
                  </Fragment>
                ))}
              </select>
            </div>

            {/* Service souhaité */}
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.service', 'Service souhaité')} <span className="text-red-500">*</span>
              </label>
              <select
                id="service"
                name="service"
                required
                value={formData.service}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              >
                <option value="">{getText('contact.form.select_service', 'Sélectionnez un service')}</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {getText(`services.nav.${service.id}`, service.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.message')} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              />
            </div>

            {/* Mode de réponse souhaité */}
            <div>
              <label htmlFor="contactPreference" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.contact_preference', 'Mode de réponse souhaité')} <span className="text-red-500">*</span>
              </label>
              <select
                id="contactPreference"
                name="contactPreference"
                required
                value={formData.contactPreference}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              >
                <option value="">{getText('contact.form.select_contact_preference', 'Sélectionnez le mode de réponse souhaité')}</option>
                {contactPreferences.map((pref) => (
                  <option key={pref.id} value={pref.id}>
                    {getText(`contact.form.preference.${pref.id}`, pref.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* Créneau horaire préféré (conditionnel) */}
            {needsTimeSlot(formData.contactPreference) && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="preferredDate" className="block text-sm font-medium text-primary dark:text-gray-300">
                    {getText('contact.form.preferred_date', 'Date souhaitée')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    required
                    value={formData.preferredDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                  />
                </div>
                <div>
                  <label htmlFor="preferredTime" className="block text-sm font-medium text-primary dark:text-gray-300">
                    {getText('contact.form.preferred_time', 'Créneau horaire préféré')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    required
                    value={formData.preferredTime}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                  >
                    <option value="">{getText('contact.form.select_time', 'Sélectionnez votre préférence')}</option>
                    <option value="morning">{getText('contact.form.time.morning', 'Matin')}</option>
                    <option value="afternoon">{getText('contact.form.time.afternoon', 'Après-midi')}</option>
                  </select>
                </div>
              </div>
            )}

            {/* Nom */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.lastName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              />
            </div>

            {/* Prénom */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.firstName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              />
            </div>

            {/* Fonction (optionnel) */}
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.job_title', 'Fonction')}
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({getText('contact.form.optional', 'optionnel')})</span>
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              />
            </div>

            {/* Entreprise */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.company')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.email')} <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-primary dark:text-gray-300">
                {getText('contact.form.phone')} <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <PhoneInput
                  country="fr"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    id: 'phone',
                    name: 'phone',
                    required: true,
                    className: "w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white pl-12 pr-3 py-2"
                  }}
                  containerClass="phone-input-container"
                  buttonClass="phone-input-button dark:bg-gray-600 dark:border-gray-500"
                  dropdownClass="phone-input-dropdown dark:bg-gray-700 dark:text-white"
                  placeholder={getText('contact.form.phone_placeholder', 'Ex: 06 12 34 56 78')}
                  specialLabel=""
                  displayFormat="### ### ### ###"
                  disableCountryCode={true}
                  enableAreaCodes={false}
                  autoFormat={true}
                  prefix=""
                  preserveOrder={['input']}
                />
              </div>
            </div>

                          {/* Adresse (optionnelle) */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getText('contact.form.address.title', 'Adresse')}
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">({getText('contact.form.address.optional', 'optionnel - utile pour recevoir plus rapidement vos produits')})</span>
                </h3>
              
              {/* Pays */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-primary dark:text-gray-300">
                  {getText('contact.form.address.country', 'Pays')}
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-primary dark:text-gray-300">
                    {getText('contact.form.address.street')}
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-primary dark:text-gray-300">
                      {getText('contact.form.address.postal_code')}
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2"
                    />
                    {formData.country === 'France' && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        {isLoadingCity ? getText('contact.form.address.city_loading', 'Recherche de la ville...') : getText('contact.form.address.city_help', 'Saisissez un code postal pour compléter automatiquement la ville')}
                      </p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="city" className="block text-sm font-medium text-primary dark:text-gray-300">
                      {getText('contact.form.address.city')}
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white px-3 py-2 ${isLoadingCity ? 'animate-pulse' : ''}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Honeypot field - hidden from users */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex="-1"
              aria-hidden="true"
            />

            {/* reCAPTCHA invisible */}
            <ReCAPTCHA
              ref={recaptchaRef}
              size="invisible"
              sitekey="6Le0qUErAAAAACR7v2j0N_k7dCRjcptlWkLJ4SPT"
              onChange={(value) => console.log("reCAPTCHA value:", value)}
            />

            {/* RGPD Consent - Modification du lien pour ouvrir le modal */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="gdprConsent"
                name="gdprConsent"
                required
                checked={formData.gdprConsent}
                onChange={handleChange}
                className="mt-1 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="gdprConsent" className="text-sm text-gray-600 dark:text-gray-400">
                {getText('contact.form.gdpr_consent')}
                {' '}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setIsPrivacyPolicyOpen(true);
                  }}
                  className="underline text-primary hover:text-primary-dark"
                >
                  {getText('contact.form.privacy_policy')}
                </button>
                .
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
              >
                {getText('contact.form.submit')}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">{getText('contact.info.title', 'Nos coordonnées')}</h2>
          <div className="space-y-4 mb-6">
            <p>
              <strong>{getText('legal.section1_company_name')}</strong>
            </p>
            <p>
              <strong>{getText('contact.info.address', 'Adresse')}:</strong><br />
              {getText('legal.section1_address1')}
            </p>
            <p>
              <strong>{getText('contact.info.phone', 'Téléphone')}:</strong><br />
              {getText('legal.section1_contact_phone')}
            </p>
            <p>
              <strong>{getText('contact.info.email', 'Email')}:</strong><br />
              <a href={`mailto:${getText('legal.section1_contact_email')}`} className="text-primary hover:underline">
                {getText('legal.section1_contact_email')}
              </a>
            </p>
          </div>

          {/* Carte */}
          <div className="h-[300px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={[iageLocation.lat, iageLocation.lng]}
              zoom={4}
              scrollWheelZoom={false}
              className="h-full w-full"
              attributionControl={true}
              zoomControl={true}
              doubleClickZoom={true}
              dragging={true}
              keyboard={true}
              touchZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[iageLocation.lat, iageLocation.lng]}>
                <Popup>
                  <div className="text-sm">
                    <strong>IAGE</strong><br />
                    {iageLocation.address}
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Modal de politique de confidentialité */}
      <PrivacyPolicyModal
        isOpen={isPrivacyPolicyOpen}
        onClose={() => setIsPrivacyPolicyOpen(false)}
      />
    </motion.div>
  )
}

export default Contact 