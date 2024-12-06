import React from 'react';
import GameDetailsNavBar from "./GameDetailsNavBar.jsx";


/**TODO :
 - Ajouter les boutons d'actions rapides
 - Mettre en forme les informations dans les blocs
 - Ajouter les différentes listes supplémentaires (jeux similaires, DLC, Suites, etc.)
 */
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
            {/* Section gauche : Image et Détails principaux */}
            <div style={styles.leftSection}>
                <img
                    src={coverImage || 'https://via.placeholder.com/300x400'}
                    alt={`${name} cover`}
                    style={styles.coverImage}
                />
            </div>

            {/* Section droite : Détails, Notes, Description, Plateformes, Genres  */}
            <div style={styles.rightSection}>
                <GameDetailsNavBar activeSection={"details"} />

                <div style={styles.mainContainer}>
                    <div style={styles.mainContent}>
                        {/* Détails et Notes côte à côte */}
                        <div style={styles.detailsAndNotes}>
                            {/* Détails */}
                            <div style={styles.detailsBox}>
                                <h2 style={styles.detailsHeader}>Détails</h2>
                                <ul style={styles.detailsList}>
                                    <li><strong>Nom :</strong> {name || "Non disponible"}</li>
                                    <li><strong>Date de sortie :</strong> {releaseDate ? new Date(releaseDate * 1000).toLocaleDateString() : "Non disponible"}</li>
                                    <li><strong>Restriction d'âge :</strong> {ageRating || "Non précisé"}</li>
                                </ul>
                            </div>

                            {/* Notes */}
                            <div style={styles.noteBox}>
                                <h2 style={styles.noteHeader}>Note</h2>
                                <div style={styles.ratings}>
                                    <div style={styles.ratingItem}>
                                        <strong>Ma Note</strong>
                                        <div style={styles.ratingValue}>{rating ? `${rating}` : "-"}</div>
                                    </div>
                                    <div style={styles.ratingItem}>
                                        <strong>Note des joueurs</strong>
                                        <div style={styles.ratingValue}>8.2</div> {/* Exemple de valeur */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Synopsis ou Description */}
                        {(detailedSynopsis && detailedSynopsis.trim() !== "") ? (
                            <div style={styles.synopsisBox}>
                                <h2 style={styles.synopsisHeader}>Synopsis</h2>
                                <p style={styles.synopsisText}>{detailedSynopsis}</p>
                            </div>
                        ) : (
                            description && (
                                <div style={styles.synopsisBox}>
                                    <h2 style={styles.synopsisHeader}>Résumé</h2>
                                    <p style={styles.synopsisText}>{description}</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Container pour Plateformes et Genres */}
                    <div style={styles.platformsAndGenres}>
                        {/* Plateformes */}
                        {platforms && platforms.length > 0 && (
                            <div style={styles.platformBox}>
                                <h2 style={styles.platformHeader}>Plateformes</h2>
                                <ul style={styles.platformList}>
                                    {platforms.map((platform) => (
                                        <li key={platform.id} style={styles.platformItem}>
                                            {platform.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Genres */}
                        {genres && genres.length > 0 && (
                            <div style={styles.genreBox}>
                                <h2 style={styles.genreHeader}>Genres</h2>
                                <ul style={styles.genreList}>
                                    {genres.map((genre) => (
                                        <li key={genre.id} style={styles.genreItem}>
                                            {genre.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Styles adaptés à la maquette
const styles = {
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        gap: '20px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        paddingBlock: '60px 80px',
        paddingInline: '50px',
    },
    leftSection: {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width: '100%',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    rightSection: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        gap: '40px',
        flex: '2',
        alignItems: 'flex-start',
    },
    mainContainer: {
        display: 'flex',
        flex: '2',
        gap: '20px',
        alignItems: 'flex-start',
    },
    mainContent: {
        flex: '3',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    detailsAndNotes: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    detailsBox: {
        flex: '1',
        backgroundColor: '#9534D580', // canal alpha : 80=50% de transparence
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    detailsHeader: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    detailsList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        lineHeight: '1.6',
    },
    noteBox: {
        flex: '1',
        backgroundColor: '#FE4A4980',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    noteHeader: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    ratings: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '10px',
    },
    ratingItem: {
        flex: '1',
        backgroundColor: '#ffffff',
        textAlign: 'center',
        borderRadius: '5px',
        padding: '10px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    },
    ratingValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#ff7043',
    },
    synopsisBox: {
        backgroundColor: '#FFBB3380',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    synopsisHeader: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    synopsisText: {
        fontSize: '14px',
        lineHeight: '1.6',
    },
    platformsAndGenres: {
        height: 'auto',
        gap: '20px',
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    platformBox: {
        backgroundColor: '#2FC75A80',
        flex: '0 0 66%',  // 2/3 de la hauteur totale
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    platformHeader: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    platformList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    platformItem: {
        padding: '5px 0',
    },
    genreBox: {
        flex: '0 0 33%',  // 1/3 de la hauteur totale
        backgroundColor: '#36A0FC80',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    genreHeader: {
        fontSize: '18px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    genreList: {
        listStyleType: 'none',
        padding: 0,
    },
    genreItem: {
        marginBottom: '8px',
    },
};

export default GameDetails;
