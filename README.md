# Bibliothèque de Jeux

Ce projet est une application web permettant de gérer une bibliothèque de jeux, comprenant un frontend avec React (configuré avec Vite) et un backend avec Node.js et Express.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés :

- [Node.js](https://nodejs.org/en/) (version 12.x ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) pour gérer les dépendances

## Lancer l'application : Côté Serveur et Côté Client

### Lancer le serveur

1. **Naviguer dans le répertoire du serveur** :
    ```bash
    cd BibliothequeJeux/server
    ```
2. **Installer les dépendances** du serveur :
    ```bash
    npm install
    ```
3. **Démarrer le serveur** :
    ```bash
    npm start
    ```
   Le serveur sera lancé par défaut sur [http://localhost:8080](http://localhost:8080). Il expose une API accessible sur `/api` qui renvoie une liste de fruits sous format JSON.

### Lancer le client

1. **Naviguer dans le répertoire du client** :
    ```bash
    cd BibliothequeJeux/client
    ```
2. **Installer les dépendances** du client :
    ```bash
    npm install
    ```
3. **Démarrer le client** :
    ```bash
    npm run dev
    ```
   L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173) dans votre navigateur.

## Scripts disponibles

Dans les répertoires `client` et `server`, vous pouvez exécuter les commandes suivantes :

### Côté Client

- **`npm run dev`** : Lance le client en mode développement.\
  Ouvrez [http://localhost:5173](http://localhost:5173) pour visualiser l’application.

- **`npm run build`** : Construit le client pour la production dans le dossier `dist`.\ 
  L’application React est prête à être déployée.

- **`npm run preview`** : Lance une prévisualisation de la version de production construite.

- **`npm run lint`** : Exécute ESLint pour vérifier la qualité du code client.

### Côté Serveur

- **`npm start`** : Lance le serveur en mode production sur le port 8080.

- **`npm run dev`** : Utilise `nodemon` pour démarrer le serveur en mode développement, avec un rechargement automatique en cas de modification.

## Problèmes connus

### `npm install` ou `npm start` ne fonctionnent pas

Si vous rencontrez des problèmes lors de l'installation ou du démarrage, assurez-vous d'avoir les versions correctes de Node.js et npm. Si le problème persiste, essayez de nettoyer le cache npm :

```bash
npm cache clean --force
