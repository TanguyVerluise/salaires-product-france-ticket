# Comparateur de Salaires - Product Managers France 🇫🇷

Une application web moderne permettant aux Product Managers de comparer leur salaire avec des profils similaires anonymisés en France.

## 🚀 Fonctionnalités

- **Recherche avancée** : Filtres par poste, années d'expérience, localisation, et taille d'équipe
- **Sécurité renforcée** : Données chiffrées avec AES-256, impossibles à déchiffrer sans la clé
- **Interface moderne** : Design inspiré de Linear (minimaliste, sombre, élégant)
- **Résultats en temps réel** : Affinage automatique des résultats selon les filtres
- **Statistiques** : Salaire moyen, médian, et score de similarité pour chaque profil

## 🔒 Sécurité

Les données sensibles sont protégées par :
- **Chiffrement AES-256** : Tous les salaires sont chiffrés avant stockage
- **Clé de chiffrement sécurisée** : Stockée uniquement dans les variables d'environnement
- **Anonymisation** : Aucune donnée personnelle identifiable n'est stockée
- **Base de données locale** : SQLite avec fichiers gitignorés

## 📦 Installation

### Prérequis
- Node.js 18+ et npm

### Étapes

1. **Cloner le repository**
```bash
git clone <url-du-repo>
cd salaires-product-france-ticket
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Générer une clé de chiffrement sécurisée
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copier la clé générée dans .env
echo "ENCRYPTION_KEY=<votre_clé_générée>" > .env
```

⚠️ **IMPORTANT** : Ne JAMAIS commiter le fichier `.env` avec la vraie clé de chiffrement!

4. **Initialiser la base de données avec des données de test**
```bash
npm run seed
```

5. **Lancer l'application en mode développement**
```bash
npm run dev
```

6. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

## 🛠️ Stack Technique

- **Framework** : Next.js 14 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS (thème Linear)
- **Base de données** : SQLite avec better-sqlite3
- **Chiffrement** : crypto-js (AES-256)
- **UI/UX** : Design inspiré de Linear

## 📁 Structure du Projet

```
salaires-product-france-ticket/
├── app/                      # Pages Next.js (App Router)
│   ├── api/                  # API Routes
│   │   ├── profiles/         # Endpoints pour les profils
│   │   └── stats/            # Endpoint pour les statistiques
│   ├── globals.css           # Styles globaux
│   ├── layout.tsx            # Layout principal
│   └── page.tsx              # Page d'accueil
├── components/               # Composants React
│   ├── SearchFilters.tsx     # Composant de filtres
│   └── SearchResults.tsx     # Composant de résultats
├── lib/                      # Logique métier
│   ├── database.ts           # Gestion de la base de données
│   └── encryption.ts         # Fonctions de chiffrement
├── scripts/                  # Scripts utilitaires
│   └── seed-database.ts      # Script d'initialisation de la DB
├── types/                    # Types TypeScript
│   └── index.ts              # Types partagés
├── data/                     # Base de données (gitignorée)
│   └── salaries.db           # Fichier SQLite
└── .env                      # Variables d'environnement (gitignorée)
```

## 🎨 Design

L'interface s'inspire de Linear avec :
- Fond sombre (#0d0d0d)
- Texte clair (#e0e0e0)
- Bordures subtiles (#2a2a2a)
- Accent bleu (#5e6ad2)
- Espacement généreux
- Typographie moderne

## 📊 API Endpoints

### POST /api/profiles/search
Recherche des profils similaires avec filtres.

**Body:**
```json
{
  "position": "Product Manager",
  "yearsOfExperience": 5,
  "location": "Paris",
  "teamSize": 3
}
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "results": [...]
}
```

### POST /api/profiles
Crée un nouveau profil (les salaires sont automatiquement chiffrés).

### GET /api/stats
Récupère les statistiques globales (postes et localisations disponibles).

## 🔐 Comment fonctionne le chiffrement ?

1. **Lors de l'ajout d'un profil** :
   - Le salaire est chiffré avec AES-256 avant stockage
   - Seule la valeur chiffrée est stockée dans la base de données

2. **Lors d'une recherche** :
   - Les filtres (poste, expérience, etc.) sont en clair pour permettre la recherche
   - Les salaires sont déchiffrés uniquement lors de l'affichage des résultats
   - Sans la clé ENCRYPTION_KEY, impossible de déchiffrer les salaires

3. **Sécurité** :
   - La clé de chiffrement n'est jamais commitée dans Git
   - Même avec accès au fichier .db, impossible de lire les salaires sans la clé
   - Les développeurs ne peuvent pas accéder aux données en production sans la clé

## 🚀 Déploiement

### Variables d'environnement requises
```bash
ENCRYPTION_KEY=<clé_de_32_bytes_en_hex>
```

### Build
```bash
npm run build
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` : Lancer en mode développement
- `npm run build` : Build pour la production
- `npm start` : Lancer en production
- `npm run lint` : Linter le code
- `npm run seed` : Initialiser la base de données avec des données de test

## 🤝 Contribution

Les contributions sont les bienvenues ! N'oubliez pas de :
1. Ne jamais commiter de données sensibles
2. Tester le chiffrement avant de proposer des modifications
3. Respecter le design inspiré de Linear

## 📄 Licence

MIT

## 🙏 Remerciements

Design inspiré par [Linear](https://linear.app)
