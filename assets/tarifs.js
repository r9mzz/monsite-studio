/* Mon Site Studio — tarifs et contact, partagés par devis.html et mobile.html */
/* ===== TARIFS : à modifier ici (une seule fois pour tout le site) (prix en euros ; null = « sur devis ») ===== */
var FORMULES = [
  { id: 'renovation', nom: 'Rénovation', desc: 'Ton site actuel modernisé : nouveau design, optimisé pour le téléphone.', prix: 200 },
  { id: 'sur-mesure', nom: 'Site sur mesure', desc: 'Un site personnalisé, adapté à ce que tu vends.', prix: 320 },
  { id: 'complet', nom: 'Site complet', desc: 'Design personnalisé, téléphone et ordinateur. Modifications incluses jusqu’à la version finale.', prix: 400, populaire: true },
  { id: 'application', nom: 'Site + application', desc: 'Ton site complet, avec une application pour tes clients.', prix: 600 }
];
var OPTIONS = [
  { id: 'logo', nom: 'Création du logo', desc: 'Un logo simple et propre, prêt pour Instagram.', prix: null },
  { id: 'textes', nom: 'On écrit les textes', desc: 'Tu nous parles, on rédige pour toi.', prix: null },
  { id: 'rdv', nom: 'Prise de rendez-vous', desc: 'Tes clients réservent un créneau en ligne.', prix: null },
  { id: 'commande', nom: 'Commande en ligne', desc: 'Panier et commande directement sur le site.', prix: null },
  { id: 'google', nom: 'Visible sur Google', desc: 'Fiche Google et référencement local.', prix: null },
  { id: 'domaine', nom: 'Adresse + hébergement', desc: 'Ton nom de domaine et l’hébergement.', prix: null }
];
var DEFAULT_FORMULE = 'complet';
// Adresse qui reçoit les demandes (vide = bouton e-mail caché)
var MS_MAIL = 'contactmonsite.studio@gmail.com';
/* ===================================================================== */
