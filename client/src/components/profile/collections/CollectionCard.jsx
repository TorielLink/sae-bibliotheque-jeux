import React, {useState, useEffect} from "react"
import {Icon, Box, IconButton, Link as MuiLink} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {Delete, Lock, LockOpen} from "@mui/icons-material"
import {Link} from "react-router-dom"


function CollectionCard({collectionData, deleteCollection}) {
    const theme = useTheme()
    const styles = getStyles(theme, collectionData)

    const [covers, setCovers] = useState([])

    useEffect(() => {
        const coversList = collectionData.collection_content.map(content => {
            return content.cover
        })
        setCovers(coversList)
    }, [collectionData])

    /*
    L'affichage des cover peut être bugé, rajouter si c'est le cas :
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        if (covers && covers.length !== 0)
            setLoading(false)
    }, [covers])
    */

    const [isCardHovered, setIsCardHovered] = useState(false)

    const handleDeleteCollection = (e) => {
        e.stopPropagation()
        deleteCollection(collectionData.game_collection_id)
    }

    return (
        <Box style={styles.container}
             onMouseEnter={() => setIsCardHovered(true)}
             onMouseLeave={() => setIsCardHovered(false)}
             sx={{
                 '&:hover': {
                     transform: 'scale(1.05)',
                 },

             }}
        >
            <IconButton
                disableTouchRipple
                onClick={(e) => handleDeleteCollection(e)}
                style={styles.deleteButton}
                sx={{
                    display: isCardHovered ? 'flex' : 'none',
                    '&:hover': {
                        transform: 'scale(1.2)',
                    },
                    '&:active': {
                        transform: 'scale(1)',
                    },
                }}>
                <Delete fontSize="large"/>
            </IconButton>
            <MuiLink component={Link} to={`/collection/${collectionData.game_collection_id}`} sx={{
                all: "unset",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
            }}>
                <div>
                    <div style={styles.coversContainer}>
                        {
                            [...covers.slice(0, 5), ...new Array(Math.max(0, 5 - covers.length)).fill(null)].map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        zIndex: -index,
                                        marginLeft: index === 0 ? '0' : '-3rem',
                                    }}
                                >
                                    {
                                        item ? <img style={styles.cover} src={item}/>
                                            : <div style={{
                                                ...styles.placeholder,
                                                transform: index % 2 === 0 ? 'rotate(180deg)' : 'none'
                                            }}/>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div style={styles.informations}>
                    <div style={styles.informations.top}>
                        <p style={styles.label}>{collectionData.name}</p>
                        {
                            <Icon style={styles.icon}>
                                {
                                    collectionData.privacy_setting_id === 1 ? (

                                        <Lock style={styles.icon.inside}/>
                                    ) : (
                                        <LockOpen style={styles.icon.inside}/>
                                    )
                                }
                            </Icon>
                        }
                    </div>
                    <p style={styles.gamesNumber}>{collectionData.collection_content.length} jeux</p>
                </div>
            </MuiLink>
        </Box>
    )
}

const getStyles = (theme) => {
    const text = {
        cursor: 'auto',
    }

    return {
        container: {
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: 'fit-content',
            zIndex: '19',
            padding: '1rem',
            gap: '0.5rem',
            cursor: 'pointer',
        },
        coversContainer: {
            width: 'fit-content',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        cover: {
            width: '7rem',
            height: '10rem',
            background: theme.palette.background.paper,
            boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
            borderRadius: '0.5rem',
        },
        placeholder: {
            width: '7rem',
            height: '10rem',
            background: `linear-gradient(${theme.palette.colors.black}, ${theme.palette.colors.white})`,
            boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
            borderRadius: '0.5rem',
        },
        informations: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: 'fit-content',
            overflow: 'hidden',
            top: {
                maxWidth: '23rem',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
        },
        label: {
            ...text,
            margin: '0',
            width: '90%',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: 'block',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '1.2rem'
        },
        gamesNumber: {
            ...text,
            margin: '0',
        },
        icon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '1.5rem',
            width: '1.5rem',
            inside: {
                height: '100%',
                width: '100%',
            },
        },
        deleteButton: {
            position: 'absolute',
            zIndex: '20',
            top: '-0.5rem',
            right: '-0.5rem',
            color: theme.palette.background.paper,
            background: theme.palette.colors.red,
            transition: 'transform 0.1s',
        },
    }
}

export default CollectionCard