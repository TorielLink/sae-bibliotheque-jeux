import React, {useState} from 'react'
import {Box, IconButton} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import GameCard from "../../GameCard.jsx"
import {Delete} from "@mui/icons-material"

function CollectionGameCard({gameData, removeGame}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const [game, setGame] = useState(gameData)

    return (
        <Box>
            {game && (
                <Box sx={{
                    position: 'relative',
                }}>
                    <IconButton
                        disableRipple
                        onClick={() => removeGame(game.id)}
                        style={styles.deleteButton}
                        sx={{
                            height: '2.5rem',
                            width: '2.5rem',
                            padding: '0.2rem',
                            '&:hover': {
                                transform: 'scale(1.05)',
                            },
                            '&:active': {
                                transform: 'scale(1)',
                            },
                        }}>
                        <Delete fontSize="large" sx={{
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

const getStyles = (theme) => {
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

export default CollectionGameCard