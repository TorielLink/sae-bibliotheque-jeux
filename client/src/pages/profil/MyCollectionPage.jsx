import React, {useContext, useState} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';

const MyCollectionPage = () => {
    const {user, token} = useContext(AuthContext);
    const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable
    const [lists, setLists] = useState([]);
    const [message, setMessage] = useState('');

    const fetchWithAuth = async (url, options = {}, token) => {
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...(options.headers || {}),
            },
        };

        const finalOptions = {
            ...defaultOptions,
            ...options,
        };

        try {
            const response = await fetch(url, finalOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            return data;
        } catch (error) {
            console.error('Erreur lors de la requête :', error.message);
            throw error;
        }
    };

    // Fonction pour récupérer les listes de jeux de l'utilisateur
    const fetchGameLists = async () => {
        if (!userId) {
            setMessage('Utilisateur non connecté');
            return;
        }

        try {
            const data = await fetchWithAuth(`/game-lists/user/${userId}`, {}, token);
            setLists(data.data); // Assurez-vous que 'data' contient les listes
        } catch (error) {
            setMessage('Erreur lors de la récupération des listes de jeux');
        }
    };

    // Fonction pour créer une nouvelle liste de jeux
    const handleCreateList = async () => {
        if (!newListName || !newListDescription) {
            setMessage('Veuillez remplir tous les champs');
            return;
        }

        const body = {
            name: newListName,
            description: newListDescription,
        };

        try {
            const data = await fetchWithAuth('/game-lists', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }, token);

            setMessage('Liste créée avec succès');
            setNewListName('');
            setNewListDescription('');
            fetchGameLists(); // Recharger les listes après création
        } catch (error) {
            setMessage('Erreur lors de la création de la liste');
        }
    };

    // Fonction pour ajouter un jeu à une liste
    const handleAddGameToList = async (listId, igdbGameId) => {
        try {
            const body = {igdb_game_id: igdbGameId};
            await fetchWithAuth(`/game-lists/${listId}/games`, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            }, token);
            setMessage('Jeu ajouté à la liste');
        } catch (error) {
            setMessage('Erreur lors de l\'ajout du jeu');
        }
    };

    // Récupérer les listes de jeux au chargement du composant
    useEffect(() => {
        if (userId) {
            fetchGameLists();
        }
    }, [userId]);

    return (
        <div>
            <h1>Listes personnalisées</h1>
            <p>ID de l'utilisateur : {userId}</p>
            <p>Bienvenue, {user?.username}</p>
            <ul>
                <li>Liste personnalisée 1 : "Jeux multijoueur"</li>
                <li>Liste personnalisée 2 : "Jeux indépendants"</li>
            </ul>
        </div>
    );
};

export default MyCollectionPage;
