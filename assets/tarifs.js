/* Mon Site Studio — tarifs et contact, partagés par devis.html et mobile.html */
/* ===== TARIFS : à modifier ici (une seule fois pour tout le site) (prix en euros ; null = « sur devis ») ===== */
// des: true = « à partir de » ; gain = ce que le client y gagne (affiché en premier)
var FORMULES = [
  { id: 'renovation', nom: 'Rénovation', gain: 'Vos visiteurs restent au lieu de repartir.', desc: 'Votre site actuel remis au goût du jour et rapide sur téléphone. Le prix dépend de ce qu’il faut refaire.', prix: 200, des: true },
  { id: 'sur-mesure', nom: 'Site sur mesure', gain: 'Les clients vous trouvent, vous font confiance et vous contactent.', desc: 'Un site créé pour votre commerce, sur téléphone et ordinateur. Modifications incluses jusqu’à ce qu’il vous plaise.', prix: 350, populaire: true },
  { id: 'premium', nom: 'Site premium', gain: 'Vous sortez du lot : on se souvient de vous et on vous choisit.', desc: 'Le site sur mesure, avec des animations et une mise en scène haut de gamme.', prix: 500, des: true },
  { id: '3d', nom: 'Site 3D et motion design', gain: 'Une vitrine unique, qui fait parler de vous.', desc: '3D, vidéo, animations avancées : chaque projet est chiffré avec vous.', prix: null }
];
var OPTIONS = [
  { id: 'logo', nom: 'Création du logo', desc: 'Un logo simple et propre, prêt pour Instagram.', prix: null },
  { id: 'textes', nom: 'Rédaction des textes', desc: 'Vous nous présentez votre activité, nous rédigeons pour vous.', prix: null },
  { id: 'rdv', nom: 'Prise de rendez-vous', desc: 'Vos clients réservent un créneau en ligne.', prix: null },
  { id: 'commande', nom: 'Commande en ligne', desc: 'Panier et commande directement sur le site.', prix: null },
  { id: 'google', nom: 'Visible sur Google', desc: 'Fiche Google et référencement local.', prix: null },
  { id: 'domaine', nom: 'Adresse + hébergement', desc: 'Votre nom de domaine et l’hébergement.', prix: null }
];
var DEFAULT_FORMULE = 'sur-mesure';
// Dépense moyenne indicative d'un client, par activité (sert à dire « le prix de N clients »)
var PANIER = { 'Traiteur / Pâtisserie': 40, 'Coiffeur / Barbier': 25, 'Beauté / Onglerie': 45, 'Restaurant / Snack': 20, 'Boutique': 40, 'Artisan': 250, 'Créateur': 50, 'Autre': 40 };
// Adresse qui reçoit les demandes (vide = bouton e-mail caché)
var MS_MAIL = 'contactmonsite.studio@gmail.com';
/* ===================================================================== */
