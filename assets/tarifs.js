/* Mon Site Studio — tarifs et contact, partagés par devis.html et mobile.html */
/* ===== TARIFS : à modifier ici (une seule fois pour tout le site) (prix en euros ; null = « sur devis ») ===== */
var FORMULES = [
  { id: 'renovation', nom: 'Rénovation', desc: 'Votre site actuel modernisé : nouveau design, optimisé pour le téléphone.', prix: 200 },
  { id: 'sur-mesure', nom: 'Site sur mesure', desc: 'Un site personnalisé, adapté à votre activité.', prix: 320 },
  { id: 'complet', nom: 'Site complet', desc: 'Design personnalisé, téléphone et ordinateur. Modifications incluses jusqu’à la version finale.', prix: 400, populaire: true },
  { id: 'application', nom: 'Site + application', desc: 'Votre site complet, avec une application pour vos clients.', prix: 600 }
];
var OPTIONS = [
  { id: 'logo', nom: 'Création du logo', desc: 'Un logo simple et propre, prêt pour Instagram.', prix: null },
  { id: 'textes', nom: 'Rédaction des textes', desc: 'Vous nous présentez votre activité, nous rédigeons pour vous.', prix: null },
  { id: 'rdv', nom: 'Prise de rendez-vous', desc: 'Vos clients réservent un créneau en ligne.', prix: null },
  { id: 'commande', nom: 'Commande en ligne', desc: 'Panier et commande directement sur le site.', prix: null },
  { id: 'google', nom: 'Visible sur Google', desc: 'Fiche Google et référencement local.', prix: null },
  { id: 'domaine', nom: 'Adresse + hébergement', desc: 'Votre nom de domaine et l’hébergement.', prix: null }
];
var DEFAULT_FORMULE = 'complet';
// Adresse qui reçoit les demandes (vide = bouton e-mail caché)
var MS_MAIL = 'contactmonsite.studio@gmail.com';
/* ===================================================================== */
