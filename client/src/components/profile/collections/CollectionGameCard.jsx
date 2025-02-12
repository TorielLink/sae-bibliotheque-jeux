import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../AuthContext.jsx';
import {Box, CircularProgress, IconButton, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import GameCard from "../../GameCard.jsx";
import {Delete, Remove, RemoveCircle} from "@mui/icons-material";

function CollectionGameCard({gameData}) {
    const {user, token} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)
    const [game, setGame] = useState(gameData)

   /* const fetchGameData = async () => {
        setLoading(true)
        try {
            if (gameData) {
                setGame(gameData)
            } else {
                const response = await fetch('http://localhost:8080/games/specific', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        gameIds: [gameId],
                    }),
                })

                const data = await response.json()
                setGame(data[0])
            }
        } catch (error) {
            console.error('Erreur lors de la récupération  :', error.message)
            setError("Erreur de chargement")
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchGameData()
    }, [])
    */

    return (
        <Box>
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
                ) : game && (
                    <Box sx={{
                        position: 'relative',
                    }}>
                        <IconButton
                            disableRipple
                            // onClick={(e) => handleDeleteCollection(e)}
                            style={styles.deleteButton}
                            sx={{
                                height: '3rem',
                                width: '3rem',
                                padding: '0',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                },
                                '&:active': {
                                    transform: 'scale(1)',
                                },
                            }}>
                            <Remove fontSize="large" sx={{
                                width: '100%',
                                height: '100%',
                            }}/>
                        </IconButton>
                        <span style={{position: 'relative'}}>
                            <GameCard
                                id={game.id}
                                title={game.name}
                                categories={game.genres}
                                image={game.cover}
                                rating={game.aggregated_rating}
                            />
                        </span>
                    </Box>
                )}
        </Box>
    )
}

const getStyles = (theme, isMobile) => {
    return {
        deleteButton: {
            position: 'absolute',
            zIndex: '5',
            top: '0.5rem',
            left: '0.5rem',
            borderRadius: '0.5rem',
            color: theme.palette.background.paper,
            background: theme.palette.colors.red,
            boxShadow: `0 0 0.2rem ${theme.palette.text.primary}`,
            transition: 'transform 0.1s',
        },
    }
}

export default CollectionGameCard;