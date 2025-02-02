# Bibliothèque de Jeux

Ce projet est une application web permettant de gérer une bibliothèque de jeux, comprenant un frontend avec React (
configuré avec Vite) et un backend avec Node.js et Express.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés :

- [Node.js](https://nodejs.org/en/) (version 12.x ou supérieure)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/) pour gérer les dépendances

## Lancer l'application dans 2 terminaux différents : Un pour le côté Serveur et un pour le côté Client

### Côté serveur

1. **Naviguer dans le répertoire du serveur** :
    ```bash
    cd ./server
    ```
2. **Installer les dépendances** du serveur :
    ```bash
    npm install
    ```
3. **Démarrer le serveur** :
    ```bash
    npm start
    ```
   Le serveur sera lancé par défaut sur [http://localhost:8080](http://localhost:8080). Il expose une API accessible sur
   `/api` qui renvoie une liste de fruits sous format JSON.

### Côté Client

1. **Naviguer dans le répertoire du client** :
    ```bash
    cd ./client
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

- **`npm run dev`** : Utilise `nodemon` pour démarrer le serveur en mode développement, avec un rechargement automatique
  en cas de modification.

## Problèmes connus

### `npm install` ou `npm start` ne fonctionnent pas

Si vous rencontrez des problèmes lors de l'installation ou du démarrage, assurez-vous d'avoir les versions correctes de
Node.js et npm. Si le problème persiste, essayez de nettoyer le cache npm :

```bash
npm cache clean --force
