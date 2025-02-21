import React, {useContext, useEffect, useState} from 'react';
import {useTheme} from "@mui/material/styles";
import {CalendarToday, ChildCare, SportsEsports} from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import {
    useMediaQuery,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Dialog,
    DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {AuthContext} from "../AuthContext.jsx";
import GameDetailsNavBar from "./GameDetailsNavBar.jsx";
import GameList from "../GameList.jsx";
import GameCard from "../GameCard.jsx";
import ButtonSelector from "./game-logs/log-details-content/ButtonSelector.jsx";
import AddComment from "../AddComment.jsx";
import AddToCollectionForm from "../profile/collections/AddToCollectionForm.jsx";


/**TODO :
 * - Coder les actions des boutons d'actions rapides
 * - Mettre en forme les informations dans les blocs (commencé)
 * - Limiter la taille des blocs (overflow: hidden)
 */
const GameDetails = ({
                         id, name, description, releaseDate, ageRating, rating, detailedSynopsis, platforms, genres,
                         coverImage, dlcs, expansions, remakes, remasters, standaloneExpansions, franchises,
                         parentGame, similarGames,
                         status, changeStatus
                     }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {isAuthenticated} = useContext(AuthContext);
    const styles = getStyles(theme, isMobile);

    const [isStatusModalOpen, setStatusModalOpen] = useState(false);

    const openStatusModal = () => {
        setStatusModalOpen(true);
    };

    const closeStatusModal = () => {
        setStatusModalOpen(false);
    };

    const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);

    const openCollectionModal = () => {
        setIsCollectionModalOpen(true);
    };

    const closeCollectionModal = () => {
        setIsCollectionModalOpen(false);
    };

    const [isAddingComment, setIsAddingComment] = useState(false);
    const handleCommentAdded = async () => {
        setIsAddingComment(false);
        await fetchReviews();
    };

    const [alertState, setAlertState] = useState({
        alertOpen: false,
        alertMessage: "",
        vertical: 'bottom',
        horizontal: 'center',
        alertSeverity: 'info'
    })

    const {vertical, horizontal, alertOpen, alertMessage, alertSeverity} = alertState

    const handleAlertClose = () => {
        setAlertState({
            ...alertState, alertOpen: false
        })
    }
    const addToCollections = async (selectedCollections) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/collection-content/update-collections/game/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({collectionsIds: selectedCollections}),
            })

            if (response.status % 300 < 1 && response.status !== 300) {
                setAlertState({
                    ...alertState,
                    alertOpen: true,
                    alertMessage: "Mise à jour des collections effectuée.",
                    alertSeverity: "success",
                })

            } else {
                setAlertState({
                    ...alertState,
                    alertOpen: true,
                    alertMessage: "Erreur de la mise à jour.",
                    alertSeverity: "error",
                })
            }
            console.log((await response.json()).message)
        } catch (error) {
            console.error('Erreur lors de la récupération  :', error.message)
        }
    }

    return (
        <div style={styles.container}>
            {/* Conteneur principal pour l'entièreté des détails du jeu */}
            <div style={styles.detailsContainer}>
                {/* Section gauche : Couverture du jeu */}
                <div style={styles.leftSection}>
                    <img
                        src={coverImage}
                        alt={`${name} cover`}
                        style={styles.coverImage}
                    />
                </div>

                {/* Section droite : Détails, Notes, Synopsis / Description, Plateformes, Genres  */}
                <div style={styles.rightSection}>
                    {!isMobile && (<GameDetailsNavBar activeSection={"details"}/>)}

                    {/* Boutons d'actions rapides */}
                    {!isMobile && isAuthenticated && (
                        <div style={styles.quickActions}>
                            {/*<button
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
                                onClick={() => setIsAddingComment(true)}
                            >
                                Ajouter un avis
                            </button>
                            {isAddingComment && (
                                <AddComment
                                    gameId={id}
                                    gameName={name}
                                    onCommentAdded={handleCommentAdded}
                                    onCancel={() => setIsAddingComment(false)}
                                />
                            )}*/}
                            {/*<button
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
                            </button>*/}
                            {/*<button
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
                            </button>*/}
                            <button
                                style={{...styles.quickActionButton, ...styles.collectionButton}}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = theme.palette.colors.purple;
                                    e.target.style.color = theme.palette.text.contrast;
                                    e.target.style.borderColor = 'transparent';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = theme.palette.background.default;
                                    e.target.style.color = theme.palette.text.primary;
                                    e.target.style.borderColor = theme.palette.colors.purple;
                                }}
                                onClick={openCollectionModal}
                            >
                                Collections
                            </button>

                            <AddToCollectionForm
                                gameId={id}
                                open={isCollectionModalOpen}
                                onClose={closeCollectionModal}
                                alertState={alertState}
                                setAlertState={setAlertState}
                            />

                            <Snackbar
                                anchorOrigin={{vertical, horizontal}}
                                open={alertOpen}
                                autoHideDuration={3000}
                                onClose={handleAlertClose}
                                key={vertical + horizontal}
                            >
                                <Alert
                                    onClose={handleAlertClose}
                                    severity={alertSeverity}
                                    variant="filled"
                                    sx={{width: '100%'}}
                                >
                                    {alertMessage}
                                </Alert>
                            </Snackbar>

                            <button
                                style={{...styles.quickActionButton, ...styles.statusButton}}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = theme.palette.colors.red;
                                    e.target.style.color = theme.palette.text.contrast;
                                    e.target.style.borderColor = 'transparent';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = theme.palette.background.default;
                                    e.target.style.color = theme.palette.text.primary;
                                    e.target.style.borderColor = theme.palette.colors.red;
                                }}
                                onClick={openStatusModal}
                            >
                                Statut
                            </button>
                            <Dialog
                                sx={{
                                    '& .MuiPaper-root': {
                                        borderRadius: '1rem',
                                        background: theme.palette.colors.yellow,
                                    },
                                }}
                                open={isStatusModalOpen}
                                onClose={closeStatusModal}
                                aria-labelledby="change-list-dialog-title"
                                aria-describedby="change-list-dialog-description"
                            >
                                <DialogTitle id="change-list-dialog-title" fontWeight="bold">Changer de
                                    liste</DialogTitle>
                                <DialogContent>
                                    <ButtonSelector
                                        disabled={false}
                                        selectedItem={status}
                                        setSelectedItem={changeStatus}
                                        fetchUrl={`${import.meta.env.VITE_BACKEND_URL}/status`}
                                        idName={'game_status_id'}
                                    />
                                </DialogContent>
                                <DialogActions>
                                    <Button style={styles.closeButton} onClick={closeStatusModal}>
                                        Fermer
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    )}

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
                                        {isMobile ? (
                                            <>
                                                <div style={styles.ratingItem}>
                                                    <div style={styles.ratingValue}>
                                                        {"-"}
                                                    </div>
                                                    <div style={styles.icon}>
                                                        <PersonIcon style={{fontSize: "1.5rem"}}/>
                                                    </div>
                                                </div>
                                                {/* Note des joueurs - Mobile */}
                                                <div style={styles.ratingItem}>
                                                    <div style={styles.ratingValue}>
                                                        {rating ? `${Math.round(rating * 100.0) / 100.0}` : "-"}
                                                    </div>
                                                    <div style={styles.icon}>
                                                        <GroupIcon style={{fontSize: "1.5rem"}}/>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div style={styles.ratingItem}>
                                                    <strong>Ma Note</strong>
                                                    <div style={styles.ratingValue}>{"-"}</div>
                                                </div>
                                                <div style={styles.ratingItem}>
                                                    <strong>Note des joueurs</strong>
                                                    <div
                                                        style={styles.ratingValue}>{rating ? `${Math.round(rating * 100.0) / 100.0}` : "-"}</div>
                                                </div>
                                            </>
                                        )}
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
            {isMobile ? (
                <>
                    {dlcs && dlcs.length > 0 && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} id="dlc-header">
                                <Typography>DLC ({dlcs.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GameList title="DLC" games={dlcs}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {expansions && expansions.length > 0 && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} id="expansions-header">
                                <Typography>Extensions ({expansions.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GameList title="Extensions" games={expansions}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {remakes && remakes.length > 0 && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} id="remakes-header">
                                <Typography>Remakes ({remakes.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GameList title="Remakes" games={remakes}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {remasters && remasters.length > 0 && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} id="remasters-header">
                                <Typography>Remasters ({remasters.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GameList title="Remasters" games={remasters}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {standaloneExpansions && standaloneExpansions.length > 0 && (
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} id="standalone-expansions-header">
                                <Typography>Standalones ({standaloneExpansions.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GameList title="Standalones" games={standaloneExpansions}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {franchises && franchises.length > 0 && (
                        <Accordion style={{width: "100%"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} id="franchises-header">
                                <Typography>Franchise - {franchises[0].name} ({franchises[0].games.length})</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GameList title="Franchise" games={franchises[0].games}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                    {parentGame && (
                        <GameCard
                            id={parentGame.id}
                            image={parentGame.cover}
                            title={parentGame.name}
                            rating={parentGame.aggregated_rating}
                            categories={parentGame.genres}
                        />
                    )}
                    {similarGames && similarGames.length > 0 && (
                        <Accordion style={{width: "100%"}}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>} id="similar-games-header">
                                <Typography>Jeux similaires</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <GameList title="Jeux Similaires" games={similarGames}/>
                            </AccordionDetails>
                        </Accordion>
                    )}
                </>
            ) : (
                <>
                    {dlcs && dlcs.length > 0 && (<GameList title="DLC" games={dlcs}/>)}
                    {expansions && expansions.length > 0 && (<GameList title="Extensions" games={expansions}/>)}
                    {remakes && remakes.length > 0 && (<GameList title="Remakes" games={remakes}/>)}
                    {remasters && remasters.length > 0 && (<GameList title="Remasters" games={remasters}/>)}
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
                </>
            )}
        </div>
    );
};

const getStyles = (theme, isMobile) => ({
    container: {
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        gap: '1.25rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        paddingBlock: isMobile ? '1rem' : '3.75rem 5rem',
        paddingInline: isMobile ? '0.938rem' : '3.125rem',
    },
    detailsContainer: {
        height: '100%',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'stretch',
        gap: '1.25rem',
        color: theme.palette.text.primary,
        marginBottom: '2rem',
    },
    leftSection: {
        width: isMobile ? '100%' : 'auto',
        marginBottom: isMobile ? '1rem' : '0',
        paddingInline: isMobile ? '2rem' : '0',
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width: '100%',
        height: isMobile ? 'auto' : '40.625rem',
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
        alignItems: isMobile ? 'center' : 'flex-start',
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
    statusButton: {
        border: '1px solid' + theme.palette.colors.red,
    },
    collectionButton: {
        border: '1px solid' + theme.palette.colors.purple,
    },
    closeButton: {
        background: theme.palette.colors.red,
        fontSize: 'large',
        color: theme.palette.text.primary,
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
    },
    dialogTitle: {
        borderBottom: `solid 0.1rem ${theme.palette.text.primary}`,
        width: 'fit-content',
        margin: '0.5rem 1rem'
    },
    mainContainer: {
        display: 'flex',
        flex: '2',
        gap: '1.25rem',
        alignItems: 'stretch',
        flexDirection: isMobile ? 'column' : 'row',
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
        marginBottom: isMobile ? '0.313' : '0.625rem',
        marginTop: isMobile ? '0' : 'auto',
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
        paddingLeft: isMobile ? '0.125rem' : '0.9375rem',
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
        backgroundColor: isMobile ? 'transparent' : theme.palette.background.paper,
        textAlign: 'center',
        borderRadius: '0.3125rem',
        padding: '0.625rem',
        boxShadow: '0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.1)',
    },
    ratingValue: {
        fontSize: isMobile ? '1rem' : '1.5rem',
        fontWeight: 'bold',
        color: theme.palette.colors.red,
    },
    synopsisText: {
        paddingLeft: isMobile ? '0.125rem' : '1.25rem',
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
        padding: isMobile ? '0.125rem 0' : '0.3125rem 0',
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
