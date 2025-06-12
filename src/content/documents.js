// Ce fichier est généré automatiquement. Ne pas modifier directement.
// Dernière génération : 2025-06-12T16:37:21.708Z

export const documents = [
  {
    "path": "/documents/Gazons/Offre_Gazon_Diagbox_V5.pdf",
    "filename": "Offre_Gazon_Diagbox_V5.pdf",
    "domain": "Gazons",
    "title": "Offre  Gazon  Diagbox  V5",
    "size": 97365,
    "lastModified": "2025-05-23T18:00:51.988Z"
  },
  {
    "path": "/documents/Gazons/Offre_Gazon_V5.pdf",
    "filename": "Offre_Gazon_V5.pdf",
    "domain": "Gazons",
    "title": "Offre  Gazon  V5",
    "size": 86719,
    "lastModified": "2025-05-23T18:00:51.990Z"
  },
  {
    "path": "/documents/Gazons/Plaquette_Gazon_V5.pdf",
    "filename": "Plaquette_Gazon_V5.pdf",
    "domain": "Gazons",
    "title": "Plaquette  Gazon  V5",
    "size": 364133,
    "lastModified": "2025-05-23T18:00:51.995Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit Maladies nosocomiales PF000043 vf.pdf",
    "filename": "Fiche produit Maladies nosocomiales PF000043 vf.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit  Maladies nosocomiales  P F000043 vf",
    "size": 2005984,
    "lastModified": "2025-05-23T18:00:52.003Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit Moisissure habitation PF000051 v2.pdf",
    "filename": "Fiche produit Moisissure habitation PF000051 v2.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit  Moisissure habitation  P F000051 v2",
    "size": 566381,
    "lastModified": "2025-05-23T18:00:52.258Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit Punaise de lit PF00002 v4.pdf",
    "filename": "Fiche produit Punaise de lit PF00002 v4.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit  Punaise de lit  P F00002 v4",
    "size": 598587,
    "lastModified": "2025-05-23T18:00:52.008Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit patho moisissure caractérisation PF000003 v2.pdf",
    "filename": "Fiche produit patho moisissure caractérisation PF000003 v2.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit patho moisissure caractérisation  P F000003 v2",
    "size": 2193460,
    "lastModified": "2025-05-23T18:00:52.017Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit patho moisissure détection PF000042 v2.pdf",
    "filename": "Fiche produit patho moisissure détection PF000042 v2.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit patho moisissure détection  P F000042 v2",
    "size": 560322,
    "lastModified": "2025-05-23T18:00:52.022Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit rongeur PF00031 v1.pdf",
    "filename": "Fiche produit rongeur PF00031 v1.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit rongeur  P F00031 v1",
    "size": 578484,
    "lastModified": "2025-05-23T18:00:52.026Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Notice d'utilisation du preleveur eau.pdf",
    "filename": "Notice d'utilisation du preleveur eau.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Notice d'utilisation du preleveur eau",
    "size": 250818,
    "lastModified": "2025-05-23T17:58:44.386Z"
  }
];

// Fonction utilitaire pour obtenir les documents par domaine
export const getDocumentsByDomain = (domain) => {
  return documents.filter(doc => doc.domain === domain);
};

// Fonction utilitaire pour obtenir tous les domaines uniques
export const getAllDomains = () => {
  return [...new Set(documents.map(doc => doc.domain))];
};
