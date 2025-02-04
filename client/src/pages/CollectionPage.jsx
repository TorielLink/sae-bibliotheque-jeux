import React, {useState, useEffect} from 'react';
import {Box, CircularProgress, Grid2, Icon, IconButton, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {
    ArrowForward,
    EditNote,
    Lock,
    LockOpen,
} from "@mui/icons-material";
import GameCard from "../components/GameCard.jsx";

function CollectionPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)

    const {id} = useParams()
    const [collection, setCollection] = useState({})

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:8080/game-collections/collection/${id}`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            setCollection(data.data)
        } catch (err) {
            console.error('Erreur lors de la récupération des données :', err)
            setError("Erreur lors de la récupération des données.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])


    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
            }}
        >
            <Typography variant="subtitle2" style={styles.breadcrumb}>
                Profil &gt; Collections &gt; {collection?.name}
            </Typography>
            {
                loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flex: '1',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress/>
                    </Box>
                ) : error ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flex: '1',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography color="error" style={styles.error}>Erreur</Typography>
                    </Box>
                ) : (
                    <div style={styles.container}>
                        {
                            isMobile && (
                                <div style={styles.buttons}>
                                    <IconButton
                                        disableTouchRipple
                                        onClick={() => navigate(`/collections`)}
                                        style={styles.button}
                                        sx={{
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                            '&:active': {
                                                transform: 'scale(1)',
                                            },
                                        }}>
                                        <p>Mes collections</p>
                                        <ArrowForward fontSize="large"/>
                                    </IconButton>
                                    <IconButton
                                        disableTouchRipple
                                        onClick={() => navigate(`/collections`)}
                                        style={styles.button}
                                        sx={{
                                            '&:hover': {
                                                transform: 'scale(1.05)',
                                            },
                                            '&:active': {
                                                transform: 'scale(1)',
                                            },
                                        }}>
                                        <p>Modifier la collection</p>
                                        <EditNote fontSize="large"/>
                                    </IconButton>
                                </div>
                            )
                        }
                        <div style={styles.topInformations}>
                            <div style={styles.titleAndPrivacy}>
                                <h1 style={styles.title}>
                                    {collection?.name}
                                </h1>
                                <div style={styles.privacy}>
                                    {
                                        <Icon style={styles.icon}>
                                            {
                                                collection?.privacy_setting_id === 1 ? (
                                                    <Lock style={styles.icon.inside}/>
                                                ) : (
                                                    <LockOpen style={styles.icon.inside}/>
                                                )
                                            }
                                        </Icon>
                                    }
                                    <p style={styles.privacyLabel}>
                                        {collection?.privacy_setting_id === 1 ? "Privé" : "Public"}
                                    </p>
                                </div>
                            </div>
                            {
                                !isMobile && (
                                    <div style={styles.buttons}>
                                        <IconButton
                                            disableTouchRipple
                                            onClick={() => navigate(`/collections`)}
                                            style={styles.button}
                                            sx={{
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                },
                                                '&:active': {
                                                    transform: 'scale(1)',
                                                },
                                            }}>
                                            <p>Mes collections</p>
                                            <ArrowForward fontSize="large"/>
                                        </IconButton>
                                        <IconButton
                                            disableTouchRipple
                                            onClick={() => navigate(`/collections`)}
                                            style={styles.button}
                                            sx={{
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                },
                                                '&:active': {
                                                    transform: 'scale(1)',
                                                },
                                            }}>
                                            <p>Modifier la collection</p>
                                            <EditNote fontSize="large"/>
                                        </IconButton>
                                    </div>
                                )
                            }
                        </div>
                        <p style={styles.description}>
                            {collection?.description}
                        </p>

                        <div style={styles.gamesContainer}>
                            <p style={styles.size}>
                                {collection.collection_content.length} jeux
                            </p>
                            <hr/>
                            <Grid2 container spacing={'2rem'} justifyContent="center" marginTop={'2rem'}>
                                {collection.collection_content.map((game, index) => {
                                    return (
                                        <Box key={index}>
                                            <GameCard
                                                id={game.id}
                                                title={game.name}
                                                categories={game.genres}
                                                image={game.cover}
                                                rating={game.aggregated_rating}
                                            />
                                        </Box>
                                    )
                                })}
                            </Grid2>
                            {
                            }
                        </div>
                    </div>
                )}
        < /Box>
    )
}

const getStyles = (theme, isMobile) => {

    const doubleContainer = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
    }
    const label = {
        fontSize: '1.5rem'
    }

    return {
        breadcrumb: {
            color: theme.palette.colors.red,
            padding: isMobile ? "0.75em 0 0 0.75em" : "1.5em 0 0 1.5em",
            font: 'Inter',
            fontSize: isMobile ? "0.9em" : "1em",
        },
        container: {
            paddingBlock: '2.5rem',
            paddingInline: isMobile ? '1rem' : '5rem',
        },
        gamesContainer: {
            paddingBlock: '1rem',
            paddingInline: isMobile ? '1rem' : '2rem',
        },
        topInformations: {
            ...doubleContainer,
            gap: '1rem',
            alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between'
        },
        titleAndPrivacy: {
            ...doubleContainer,
            gap: isMobile ? '0.5rem' : '2rem',
            alignItems: 'baseline'
        },
        title: {
            fontSize: isMobile ? '2rem' : '5rem',
            fontWeight: 'bold',
            margin: '0',
        },
        privacy: {
            ...doubleContainer,
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: '0.2rem',
        },
        privacyLabel: {
            ...label,
            margin: '0',
            lineHeight: '1.2'
        },
        icon: {
            display: 'flex',
            justifyContent: 'center',
            height: '2.5rem',
            width: '2.5rem',
            inside: {
                height: '100%',
                width: '100%',
            },
        },
        buttons: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            marginBottom: isMobile ? '1rem' : '0'
        },
        button: {
            boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
            borderRadius: '0.5rem',
            background: theme.palette.background.paper,
            height: 'fit-content',
            color: theme.palette.text.primary,
            fontSize: '1rem',
            padding: '0 1rem',
            margin: '0',
            gap: '0.5rem',
        },
        description: {
            ...label,
            fontStyle: 'italic',
        },
        size: {
            ...label,
        },
    }
}

export default CollectionPage;