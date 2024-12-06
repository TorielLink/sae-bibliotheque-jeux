import React from 'react';
import { CalendarToday, ChildCare, SportsEsports } from '@mui/icons-material';
import GameDetailsNavBar from "./GameDetailsNavBar.jsx";


/**TODO :
 * - Coder les actions des boutons d'actions rapides
 * - Mettre en forme les informations dans les blocs (commencé)
 * - Limiter la taille des blocs (overflow: hidden)
 * - Ajouter les différentes listes supplémentaires (jeux similaires, DLC, Suites, etc.)
 */
const GameDetails = ({name, description, releaseDate, ageRating, rating, detailedSynopsis, platforms, genres,
                         coverImage, dlcs, expansions, remakes, remasters, standaloneExpansions, franchises,
                         parentGame, similarGames}) => {
    return (
        <div style={styles.container}>
            {/* Section gauche : Couverture du jeu */}
            <div style={styles.leftSection}>
                <img
                    src={coverImage || 'https://via.placeholder.com/300x400'}
                    alt={`${name} cover`}
                    style={styles.coverImage}
                />
            </div>

            {/* Section droite : Détails, Notes, Synopsis / Description, Plateformes, Genres  */}
            <div style={styles.rightSection}>
                <GameDetailsNavBar activeSection={"details"} />

                {/* Boutons d'actions rapides */}
                <div style={styles.quickActions}>
                    <button
                        style={{...styles.quickActionButton, ...styles.reviewButton}}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#36A0FC';
                            e.target.style.color = '#FFF';
                            e.target.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#FFF';
                            e.target.style.color = '#000';
                            e.target.style.borderColor = '#36A0FC';
                        }}
                    >
                        Ajouter un avis
                    </button>
                    <button
                        style={{...styles.quickActionButton, ...styles.noteButton}}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#2FC75A';
                            e.target.style.color = '#FFF';
                            e.target.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#FFF';
                            e.target.style.color = '#000';
                            e.target.style.borderColor = '#2FC75A';
                        }}
                    >
                        Ajouter une note
                    </button>
                    <button
                        style={{...styles.quickActionButton, ...styles.logButton}}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#FFBB33';
                            e.target.style.color = '#FFF';
                            e.target.style.borderColor = 'transparent';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#FFF';
                            e.target.style.color = '#000';
                            e.target.style.borderColor = '#FFBB33';
                        }}
                    >
                        Ajouter un journal
                    </button>
                </div>

                <div style={styles.mainContainer}>
                    <div style={styles.mainContent}>
                        {/* Détails et Notes */}
                        <div style={styles.detailsAndNotes}>
                            {/* Détails */}
                            <div style={styles.detailsBox}>
                                <h2 style={styles.categoryHeader}>Détails</h2>
                                <ul style={styles.detailsList}>
                                    <li><SportsEsports style={styles.icon}/> {name || "Non disponible"}</li>
                                    <li><CalendarToday style={styles.icon}/> {
                                        releaseDate ? new Date(releaseDate * 1000).toLocaleDateString() :
                                            "Non disponible"}</li>
                                    {/* TODO : associer `ageRatingCategory` pour comprendre la valeur de `ageRating` */}
                                    <li><ChildCare style={styles.icon} /> {ageRating || "Non précisé"}</li>
                                </ul>
                            </div>

                            {/* Notes */}
                            <div style={styles.noteBox}>
                                <h2 style={styles.categoryHeader}>Note</h2>
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
                                <h2 style={styles.categoryHeader}>Synopsis</h2>
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

                    {/* Plateformes et Genres */}
                    <div style={styles.platformsAndGenres}>
                        {/* Plateformes */}
                        {platforms && platforms.length > 0 && (
                            <div style={styles.platformBox}>
                                <h2 style={styles.categoryHeader}>Plateformes</h2>
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
                                <h2 style={styles.categoryHeader}>Genres</h2>
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
            {/*TODO: ajouter les listes de jeux DLC, extensions, jeux similaires, etc.
               TODO: utiliser les composants avis de @Nicolas*/}
        </div>
    );
};

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
        width: '420px',
        height: '650px',
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
    quickActions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: '20px',
    },
    quickActionButton: {
        padding: '10px 5%',
        border: 'none',
        borderRadius: '10px',
        backgroundColor: '#FFF',
        fontSize: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    reviewButton: {
        border: '1px solid #36A0FC',
    },
    noteButton: {
        border: '1px solid #2FC75A',
    },
    logButton: {
        border: '1px solid #FFBB33',
    },
    mainContainer: {
        display: 'flex',
        flex: '2',
        gap: '20px',
        alignItems: 'stretch',
    },
    mainContent: {
        flex: '3',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowX: 'scroll',
    },
    categoryHeader: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '10px',
    },
    detailsAndNotes: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    detailsBox: {
        display: 'block',
        flex: '1',
        backgroundColor: '#9534D580', // canal alpha : 80=50% de transparence
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    detailsList: {
        listStyle: 'none',
        paddingLeft: '15px',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '67%',
    },
    icon: {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '4px',
        color: '#333',
    },
    noteBox: {
        flex: '1',
        backgroundColor: '#FE4A4980',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
    synopsisText: {
        paddingLeft: '20px',
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
        flex: '0 0 66%',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
        flex: '0 0 33%',
        backgroundColor: '#36A0FC80',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
