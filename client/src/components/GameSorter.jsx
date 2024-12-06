import React from 'react';

function GameSorter({games = [], sortBy, order = 'desc', children}) {
    // Vérifier si games est un tableau
    if (!Array.isArray(games)) {
        console.error('GameSorter: "games" doit être un tableau.');
        return null;
    }

    const sortedGames = [...games].sort((a, b) => {
        if (sortBy === 'date') {
            return order === 'asc'
                ? new Date(a.releaseDate) - new Date(b.releaseDate)
                : new Date(b.releaseDate) - new Date(a.releaseDate);
        } else if (sortBy === 'rating') {
            return order === 'asc' ? a.rating - b.rating : b.rating - a.rating;
        }
        return 0;
    });

    return children(games);
}

export default GameSorter;
