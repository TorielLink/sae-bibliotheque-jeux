import React from 'react';
import {CalendarToday, ChildCare, SportsEsports} from '@mui/icons-material';
import GameDetailsNavBar from "./GameDetailsNavBar.jsx";
import {useTheme} from "@mui/material/styles";
import GameList from "./GameList.jsx";
import GameCard from "./GameCard.jsx";


/**TODO :
 * - Coder les actions des boutons d'actions rapides
 * - Mettre en forme les informations dans les blocs (commencé)
 * - Limiter la taille des blocs (overflow: hidden)
 * - Ajouter les différentes listes supplémentaires (jeux similaires, DLC, Suites, etc.)
 */
const GameDetails = ({
                         name, description, releaseDate, ageRating, rating, detailedSynopsis, platforms, genres,
                         coverImage, dlcs, expansions, remakes, remasters, standaloneExpansions, franchises,
                         parentGame, similarGames
                     }) => {
    const theme = useTheme();
    const styles = getStyles(theme);

    return (
        <div style={styles.container}>
            {/* Conteneur principal pour l'entièreté des détails du jeu */}
            <div style={styles.detailsContainer}>
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
                    <GameDetailsNavBar activeSection={"details"}/>

                    {/* Boutons d'actions rapides */}
                    <div style={styles.quickActions}>
                        <button
                            style={{...styles.quickActionButton, ...styles.reviewButton}}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = theme.palette.colors.blue;
                                e.target.style.color = theme.palette.text.contrast;
                                e.target.style.borderColor = 'transparent';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = theme.palette.background.default;
                                e.target.style.color = theme.palette.text.primary;
                                e.target.style.borderColor = theme.palette.colors.blue;
                            }}
                        >
                            Ajouter un avis
                        </button>
                        <button
                            style={{...styles.quickActionButton, ...styles.noteButton}}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = theme.palette.colors.green;
                                e.target.style.color = theme.palette.text.contrast;
                                e.target.style.borderColor = 'transparent';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = theme.palette.background.default;
                                e.target.style.color = theme.palette.text.primary;
                                e.target.style.borderColor = theme.palette.colors.green;
                            }}
                        >
                            Ajouter une note
                        </button>
                        <button
                            style={{...styles.quickActionButton, ...styles.logButton}}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = theme.palette.colors.yellow;
                                e.target.style.color = theme.palette.text.contrast;
                                e.target.style.borderColor = 'transparent';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = theme.palette.background.default;
                                e.target.style.color = theme.palette.text.primary;
                                e.target.style.borderColor = theme.palette.colors.yellow;
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
                                <div style={{
                                    ...styles.box,
                                    backgroundColor: theme.palette.transparentColors['purple-50']
                                }}>
                                    <h2 style={styles.categoryHeader}>Détails</h2>
                                    <ul style={styles.detailsList}>
                                        <li><SportsEsports style={styles.icon}/> {name || "Non disponible"}</li>
                                        <li><CalendarToday style={styles.icon}/> {
                                            releaseDate ? new Date(releaseDate * 1000).toLocaleDateString() :
                                                "Non disponible"}</li>
                                        <li><ChildCare style={styles.icon}/> {ageRating || "Non précisé"}</li>
                                    </ul>
                                </div>

                                {/* Notes */}
                                <div
                                    style={{...styles.box, backgroundColor: theme.palette.transparentColors['red-50']}}>
                                    <h2 style={styles.categoryHeader}>Note</h2>
                                    <div style={styles.ratings}>
                                        <div style={styles.ratingItem}>
                                            <strong>Ma Note</strong>
                                            <div style={styles.ratingValue}>{"-"}</div>
                                        </div>
                                        <div style={styles.ratingItem}>
                                            <strong>Note des joueurs</strong>
                                            <div style={styles.ratingValue}>{rating ? `${rating}` : "-"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Synopsis ou Description */}
                            {(detailedSynopsis && detailedSynopsis.trim() !== "") ? (
                                <div style={{
                                    ...styles.box,
                                    backgroundColor: theme.palette.transparentColors['yellow-50']
                                }}>
                                    <h2 style={styles.categoryHeader}>Synopsis</h2>
                                    <p style={styles.synopsisText}>{detailedSynopsis}</p>
                                </div>
                            ) : (
                                description && (
                                    <div style={{
                                        ...styles.box,
                                        backgroundColor: theme.palette.transparentColors['yellow-50']
                                    }}>
                                        <h2 style={styles.categoryHeader}>Résumé</h2>
                                        <p style={styles.synopsisText}>{description}</p>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Plateformes et Genres */}
                        <div style={styles.platformsAndGenres}>
                            {/* Plateformes */}
                            {platforms && platforms.length > 0 && (
                                <div style={{
                                    ...styles.box,
                                    backgroundColor: theme.palette.transparentColors['green-50']
                                }}>
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
                                <div style={{
                                    ...styles.box,
                                    backgroundColor: theme.palette.transparentColors['blue-50']
                                }}>
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
            </div>

            {/*Listes des jeux similiares, extensions, etc.*/}
            {dlcs && dlcs.length > 0 && (
                <GameList title="DLC" games={dlcs}/>)}
            {expansions && expansions.length > 0 && (
                <GameList title="Extensions" games={expansions}/>)}
            {remakes && remakes.length > 0 && (
                <GameList title="Remakes" games={remakes}/>)}
            {remasters && remasters.length > 0 && (
                <GameList title="Remasters" games={remasters}/>)}
            {standaloneExpansions && standaloneExpansions.length > 0 && (
                <GameList title="Standalones" games={standaloneExpansions}/>)}
            {franchises && franchises.length > 0 && (
                <GameList title={"Franchise - " + franchises[0].name} games={franchises[0].games}/>)}
            {parentGame && (
                <GameCard
                    id={parentGame.id}
                    image={parentGame.cover}
                    title={parentGame.name}
                    rating={parentGame.aggregated_rating}
                    categories={parentGame.genres}
                />)}

            {similarGames && similarGames.length > 0 && (
                <GameList title="Jeux similaires" games={similarGames}/>)}
        </div>
    );
};

const getStyles = (theme) => ({
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        gap: '1.25rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        paddingBlock: '3.75rem 5rem',
        paddingInline: '3.125rem',
    },
    detailsContainer: {
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        gap: '1.25rem',
        color: theme.palette.text.primary,
        marginBottom: '2rem',
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
        height: '40.625rem',
        borderRadius: '0.625rem',
        boxShadow: '0 0.25rem 0.5rem rgba(0, 0, 0, 0.1)',
    },
    rightSection: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        gap: '2.5rem',
        flex: '2',
        alignItems: 'flex-start',
    },
    quickActions: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        gap: '2.5rem',
    },
    quickActionButton: {
        padding: '0.625rem 5%',
        border: 'none',
        borderRadius: '1rem',
        backgroundColor: theme.palette.background.default,
        fontSize: '0.75rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s, transform 0.2s',
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)',
    },
    reviewButton: {
        border: '1px solid' + theme.palette.colors.blue,
    },
    noteButton: {
        border: '1px solid' + theme.palette.colors.green,
    },
    logButton: {
        border: '1px solid' + theme.palette.colors.yellow,
    },
    mainContainer: {
        display: 'flex',
        flex: '2',
        gap: '1.25rem',
        alignItems: 'stretch',
    },
    mainContent: {
        flex: '3',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    categoryHeader: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: theme.palette.text.primary,
        marginBottom: '0.625rem',
    },
    box: {
        flex: '1',
        padding: '0.9375rem',
        borderRadius: '0.625rem',
        boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.1)',
    },
    detailsAndNotes: {
        display: 'flex',
        gap: '1.25rem',
        flexWrap: 'wrap',
    },
    detailsList: {
        listStyle: 'none',
        paddingLeft: '0.9375rem',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        height: '67%',
    },
    icon: {
        display: 'inline-block',
        verticalAlign: 'middle',
        marginRight: '0.25rem',
        color: theme.palette.text.primary,
    },
    ratings: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.625rem',
    },
    ratingItem: {
        flex: '1',
        backgroundColor: theme.palette.background.paper,
        textAlign: 'center',
        borderRadius: '0.3125rem',
        padding: '0.625rem',
        boxShadow: '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1)',
    },
    ratingValue: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: theme.palette.colors.red,
    },
    synopsisText: {
        paddingLeft: '1.25rem',
        fontSize: '0.875rem',
        lineHeight: '1.6',
    },
    platformsAndGenres: {
        height: 'auto',
        gap: '1.25rem',
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    platformList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    platformItem: {
        padding: '0.3125rem 0',
    },
    genreList: {
        listStyleType: 'none',
        padding: 0,
    },
    genreItem: {
        marginBottom: '0.5rem',
    },
});

export default GameDetails;
