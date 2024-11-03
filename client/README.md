# Bibliothèque de Jeux

Ce projet est une application web développée avec React et Express qui permet de gérer une bibliothèque de jeux.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :
- [Node.js](https://nodejs.org/en/) (version 12.x ou supérieure)
- [npm](https://www.npmjs.com/) (installé automatiquement avec Node.js)

## Installation

Suivez ces étapes pour installer et lancer l'application sur votre machine :

### Installation des dépendances

1. **Backend (côté serveur)** :  
   Depuis le répertoire `server` :
    ```bash
    cd server
    npm install
    ```

2. **Frontend (côté client)** :  
   Depuis le répertoire `client` :
    ```bash
    cd ../client
    npm install
    ```

### Démarrage de l'application

1. **Démarrer le backend (serveur Express)** :  
   Depuis le répertoire `server` :
    ```bash
    npm start
    ```
    Le serveur backend sera accessible à [http://localhost:8080](http://localhost:8080).

2. **Démarrer le frontend (application React)** :  
   Depuis le répertoire `client` :
    ```bash
    npm run dev
    ```
    L'application frontend sera accessible à [http://localhost:5173](http://localhost:5173).

## Scripts disponibles

Dans le répertoire du projet, vous pouvez exécuter les commandes suivantes :

### `npm start` (dans le répertoire `server`)

Lance le serveur Express en mode développement. Par défaut, il écoute sur le port 8080 et fournit des données à l'application frontend.

### `npm run dev` (dans le répertoire `client`)

Lance l'application React en mode développement via Vite. Elle est accessible à l'adresse [http://localhost:5173](http://localhost:5173) dans votre navigateur.

### `npm run build` (dans le répertoire `client`)

Construit l'application React pour la production dans le répertoire `dist`. Ce build est optimisé et prêt pour le déploiement.

## Problèmes connus

Si vous rencontrez des problèmes lors de l'installation ou du démarrage de l'application, assurez-vous d'avoir les versions correctes de Node.js et npm installées. Si le problème persiste, essayez de nettoyer le cache npm ou de supprimer le répertoire `node_modules` :

```bash
npm cache clean --force
