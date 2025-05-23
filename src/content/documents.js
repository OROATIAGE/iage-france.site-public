// Ce fichier est généré automatiquement. Ne pas modifier directement.
// Dernière génération : 2025-05-23T16:42:21.698Z

export const documents = [
  {
    "path": "/documents/Gazons/Offre_Gazon_Diagbox_V5.pdf",
    "filename": "Offre_Gazon_Diagbox_V5.pdf",
    "domain": "Gazons",
    "title": "Offre  Gazon  Diagbox  V5",
    "size": 97365,
    "lastModified": "2025-05-21T11:24:54.197Z"
  },
  {
    "path": "/documents/Gazons/Plaquette_Gazon_V5.pdf",
    "filename": "Plaquette_Gazon_V5.pdf",
    "domain": "Gazons",
    "title": "Plaquette  Gazon  V5",
    "size": 364133,
    "lastModified": "2025-05-21T11:24:54.193Z"
  },
  {
    "path": "/documents/Gazons/Offre_Gazon_V5.pdf",
    "filename": "Offre_Gazon_V5.pdf",
    "domain": "Gazons",
    "title": "Offre  Gazon  V5",
    "size": 86719,
    "lastModified": "2025-05-21T11:24:54.186Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Notice d'utilisation preleveur d'eau.pdf",
    "filename": "Notice d'utilisation preleveur d'eau.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Notice d'utilisation preleveur d'eau",
    "size": 62244631,
    "lastModified": "2025-05-23T16:10:19.778Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit patho moisissure caractérisation PF000003 v2.pdf",
    "filename": "Fiche produit patho moisissure caractérisation PF000003 v2.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit patho moisissure caractérisation  P F000003 v2",
    "size": 2193460,
    "lastModified": "2025-05-23T16:08:53.856Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit rongeur PF00031 v1.pdf",
    "filename": "Fiche produit rongeur PF00031 v1.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit rongeur  P F00031 v1",
    "size": 578484,
    "lastModified": "2025-05-23T16:08:52.652Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit Punaise de lit PF00002 v4.pdf",
    "filename": "Fiche produit Punaise de lit PF00002 v4.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit  Punaise de lit  P F00002 v4",
    "size": 598587,
    "lastModified": "2025-05-23T16:08:51.954Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit Maladies nosocomiales PF000043 vf.pdf",
    "filename": "Fiche produit Maladies nosocomiales PF000043 vf.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit  Maladies nosocomiales  P F000043 vf",
    "size": 2005984,
    "lastModified": "2025-05-23T16:08:51.309Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/Fiche produit patho moisissure détection PF000042 v2.pdf",
    "filename": "Fiche produit patho moisissure détection PF000042 v2.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "Fiche produit patho moisissure détection  P F000042 v2",
    "size": 560322,
    "lastModified": "2025-05-23T16:08:50.940Z"
  },
  {
    "path": "/documents/Santé_publique_et_hygiene/fiche produit Moisissure habitation PF000051 v2.pdf",
    "filename": "fiche produit Moisissure habitation PF000051 v2.pdf",
    "domain": "Santé_publique_et_hygiene",
    "title": "fiche produit  Moisissure habitation  P F000051 v2",
    "size": 566381,
    "lastModified": "2025-05-23T16:08:47.957Z"
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
