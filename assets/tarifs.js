/* Mon Site Studio — tarifs et contact, partagés par devis.html et mobile.html */
/* ===== TARIFS : à modifier ici (une seule fois pour tout le site) (prix en euros ; null = « sur devis ») ===== */
// gain = ce que le client y gagne (affiché en premier)
// principale: true = une des 2 formules mises en avant ; mois = abonnement mensuel en plus de la création ;
// des: true = « à partir de » ; ancien = ancien prix, affiché barré ; pts = ce qui est compris ; prix null = sur devis
var FORMULES = [
  { id: 'livre', principale: true, num: 'Formule 1', nom: 'Site livré', gain: 'Le site est à vous, vous le gérez vous-même.', desc: 'Votre site créé et livré, avec un espace simple pour changer vos photos et vos textes.', prix: 400,
    pts: ['Votre site, sur téléphone et ordinateur', 'Un espace simple pour changer vos photos et vos textes', 'Nom de domaine à votre nom, à votre charge', 'Grosse modification sur demande : 20 €'] },
  { id: 'suivi', principale: true, num: 'Formule 2', nom: 'Site suivi', gain: 'On s’occupe de tout, vous n’avez rien à gérer.', desc: 'Création à 250 €, puis 50 € par mois : hébergement, nom de domaine et modifications compris.', prix: 250, mois: 50,
    pts: ['Création du site : 250 €', 'Hébergement et nom de domaine compris', 'Vos modifications faites vite, sur simple message', 'Sans engagement, un mois de préavis', 'Vous arrêtez ? Gardez votre site pour 150 €'] },
  { id: 'renovation', nom: 'Rénovation', gain: 'Vos visiteurs restent au lieu de repartir.', desc: 'Votre site actuel remis au goût du jour et rapide sur téléphone. Le prix dépend de ce qu’il faut refaire.', prix: 150, ancien: 200, des: true },
  { id: '3d', nom: 'Site 3D, application', gain: 'Une vitrine unique, qui fait parler de vous.', desc: '3D, vidéo, application, animations avancées : chaque projet est chiffré avec vous.', prix: null }
];
var OPTIONS = [
  { id: 'logo', nom: 'Création du logo', desc: 'Un logo simple et propre, prêt pour Instagram.', prix: null },
  { id: 'textes', nom: 'Rédaction des textes', desc: 'Vous nous présentez votre activité, nous rédigeons pour vous.', prix: null },
  { id: 'rdv', nom: 'Prise de rendez-vous', desc: 'Vos clients réservent un créneau en ligne.', prix: null },
  { id: 'commande', nom: 'Commande en ligne', desc: 'Panier et commande directement sur le site.', prix: null },
  { id: 'google', nom: 'Visible sur Google', desc: 'Fiche Google et référencement local.', prix: null },
  { id: 'domaine', nom: 'Adresse + hébergement', desc: 'Votre nom de domaine et l’hébergement.', prix: null }
];
var DEFAULT_FORMULE = 'livre';
// Dépense moyenne indicative d'un client, par activité (sert à dire « le prix de N clients »)
var PANIER = { 'Traiteur / Pâtisserie': 40, 'Coiffeur / Barbier': 25, 'Beauté / Onglerie': 45, 'Restaurant / Snack': 20, 'Boutique': 40, 'Artisan': 250, 'Créateur': 50, 'Autre': 40 };
// Adresse qui reçoit les demandes (vide = bouton e-mail caché)
var MS_MAIL = 'contactmonsite.studio@gmail.com';
// Codes promo des partenaires : remise en % pour le client, et qui l'a apporté
var CODES = { SWEETDELICES: { remise: 5, parrain: 'Sweet Délices' } };
/* ===================================================================== */
