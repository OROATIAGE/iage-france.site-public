import { sendgrid } from '@sendgrid/mail';

// Rate limiting setup
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limite à 5 requêtes par fenêtre
};

const rateLimitMap = new Map();

// Validation des emails
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Liste des domaines autorisés pour l'envoi
const ALLOWED_DOMAINS = ['iage.fr'];

// Validation du domaine d'envoi
const isAllowedSender = (email) => {
  const domain = email.split('@')[1];
  return ALLOWED_DOMAINS.includes(domain);
};

// Configuration SendGrid
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // Vérification de la méthode HTTP
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const now = Date.now();
  const userRequests = rateLimitMap.get(clientIp) || [];
  
  // Nettoyage des anciennes requêtes
  const recentRequests = userRequests.filter(
    timestamp => now - timestamp < rateLimit.windowMs
  );
  
  if (recentRequests.length >= rateLimit.max) {
    return res.status(429).json({ 
      error: 'Too many requests, please try again later' 
    });
  }
  
  rateLimitMap.set(clientIp, [...recentRequests, now]);

  try {
    const {
      sector,
      service,
      lastName,
      firstName,
      jobTitle,
      company,
      email,
      phone,
      contactPreference,
      preferredTime,
      message,
    } = req.body;

    // Validation des données requises
    if (!lastName || !firstName || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields' 
      });
    }

    // Validation de l'email
    if (!isValidEmail(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Construction du corps de l'email
    const emailBody = `
INFORMATIONS DE CONTACT
----------------------
Nom: ${lastName}
Prénom: ${firstName}
Fonction: ${jobTitle || 'Non spécifié'}
Entreprise: ${company || 'Non spécifié'}
Email: ${email}
Téléphone: ${phone || 'Non spécifié'}

DÉTAILS DE LA DEMANDE
--------------------
Secteur: ${sector || 'Non spécifié'}
Service: ${service || 'Non spécifié'}
Mode de réponse: ${contactPreference || 'Non spécifié'}
${preferredTime ? `Demi-journée préférée: ${preferredTime}` : ''}

MESSAGE
-------
${message}
    `.trim();

    // Configuration de l'email
    const msg = {
      to: 'contact@iage.fr',
      from: {
        email: 'noreply@iage.fr',
        name: 'Formulaire de Contact IAGE'
      },
      subject: `Nouvelle demande de contact - ${sector || 'Non spécifié'}`,
      text: emailBody,
      replyTo: email
    };

    // Envoi de l'email
    await sendgrid.send(msg);

    return res.status(200).json({ 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ 
      error: 'Error sending email' 
    });
  }
} 