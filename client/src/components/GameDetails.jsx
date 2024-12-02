import React from 'react';

const GameDetails = ({
                         name,
                         description,
                         releaseDate,
                         ageRating,
                         rating,
                         detailedSynopsis,
                         platforms,
                         genres,
                         coverImage,
                     }) => {
    return (
        <div style={styles.container}>
            {/* Header avec le titre et la jaquette */}
            <div style={styles.header}>
                <img
                    src={coverImage || 'https://via.placeholder.com/300x400'}
                    alt={`${name} cover`}
                    style={styles.coverImage}
                />
                <h1 style={styles.title}>{name}</h1>
            </div>

            {/* Description */}
            <p style={styles.description}><strong>Description :</strong> {description || "Aucune description disponible."}</p>

            {/* Informations principales */}
            <div style={styles.detailsContainer}>
                <div style={styles.detailItem}>
                    <strong>Date de sortie :</strong> {releaseDate ? new Date(releaseDate * 1000).toLocaleDateString() : "Non disponible"}
                </div>
                <div style={styles.detailItem}>
                    <strong>Restriction d'âge :</strong> {ageRating || "Non précisé"}
                </div>
                <div style={styles.detailItem}>
                    <strong>Note :</strong> {rating ? `${rating} / 100` : "Pas encore évalué"}
                </div>
            </div>

            {/* Synopsis détaillé */}
            {detailedSynopsis && (
                <div style={styles.synopsis}>
                    <h2>Synopsis détaillé</h2>
                    <p>{detailedSynopsis}</p>
                </div>
            )}

            {/* Plateformes */}
            {platforms && platforms.length > 0 && (
                <div style={styles.listSection}>
                    <h2>Plateformes disponibles</h2>
                    <ul>
                        {platforms.map((platform) => (
                            <li key={platform.id}>{platform.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Genres */}
            {genres && genres.length > 0 && (
                <div style={styles.listSection}>
                    <h2>Genres</h2>
                    <ul>
                        {genres.map((genre) => (
                            <li key={genre.id}>{genre.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Styles inline pour une présentation simple
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        maxWidth: '800px',
        margin: '0 auto',
        border: '1px solid #ddd',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    coverImage: {
        width: '300px',
        borderRadius: '10px',
        marginBottom: '15px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
    },
    description: {
        fontSize: '16px',
        marginBottom: '20px',
    },
    detailsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    detailItem: {
        flex: '0 0 48%',
        marginBottom: '10px',
    },
    synopsis: {
        marginBottom: '20px',
    },
    listSection: {
        marginBottom: '20px',
    },
};

export default GameDetails;
