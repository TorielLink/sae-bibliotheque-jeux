import React, {useState, useEffect} from 'react';
import {
    Box,
    Breadcrumbs,
    Link as MuiLink,
    CircularProgress,
    Typography,
    useMediaQuery,
    TextField,
    Icon, Button, Divider, Grid2
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useNavigate, useParams} from "react-router-dom";
import {Lock, LockOpen, NavigateNext} from "@mui/icons-material";
import {Link} from 'react-router-dom';
import HorizontalSelector from "../components/game-details/game-logs/log-details-content/HorizontalSelector.jsx";
import GameSearch from "../components/profile/collections/GameSearch.jsx";
import GameCard from "../components/GameCard.jsx";

function CollectionEditPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)
    const navigate = useNavigate()

    const {id} = useParams()
    const [collection, setCollection] = useState({})
    const [privacySettings, setPrivacySettings] = useState()

    useEffect(() => {
        setName(collection?.name)
        setDescription(collection?.description)
        setPrivacy(collection?.privacy_setting_id)
        setCollectionContent(collection?.collection_content)
    }, [collection])

    const fetchData = async () => {
        try {
            setLoading(true)
            const storedCollection = localStorage.getItem(`collection_${id}`)
            const collection = storedCollection ? JSON.parse(storedCollection) : null
            setCollection(collection)
            const response = await fetch(`http://localhost:8080/privacy-settings`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
            const data = await response.json()
            setPrivacySettings(data.data)

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


    const [name, setName] = useState("")
    const handleNameChange = (event) => {
        setName(event.target.value)
    }

    const [description, setDescription] = useState("")
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const [privacy, setPrivacy] = useState(1)
    const handlePrivacySettingChange = (event) => {
        setPrivacy(Number(event.target.value))
    }

    const [collectionContent, setCollectionContent] = useState([])

    const addGame = (gameId) => {
        console.log(`Jeu sélectionné : ${gameId}`)
        // navigate(`/details/${game.id}`)
        // setSelectedGame(game)
    }

    const cancelEdit = () => {
        navigate(`/collection/${id}`)
    }

    const saveEdit = () => {

        navigate(`/collection/${id}`)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
            }}
        >
            <Breadcrumbs
                separator={<NavigateNext/>}
                style={styles.breadcrumbs}
            >
                <MuiLink component={Link} to="/profile" underline="hover" style={styles.breadcrumb}>
                    Profil
                </MuiLink>
                <MuiLink component={Link} to="/collections" underline="hover" style={styles.breadcrumb}>
                    Collections
                </MuiLink>
                <MuiLink component={Link} to={`/collection/${id}`} underline="hover" style={styles.breadcrumb}>
                    {collection?.name}
                </MuiLink>
                <MuiLink component={Link} to={`/collection/${id}/edit`} underline="hover" style={styles.breadcrumb}>
                    Modifier
                </MuiLink>
            </Breadcrumbs>
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
                        <div style={styles.informationsContainer}>
                            <div style={styles.horizontalContainer}>
                                <TextField
                                    id="name"
                                    style={styles.name}
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="Nom"
                                    slotProps={{
                                        htmlInput: {
                                            maxLength: 100,
                                        },
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            border: 'none',
                                        },
                                        '& .Mui-focused': {
                                            borderRadius: '0.5rem',
                                            background: theme.palette.background.paper,
                                        },
                                    }}
                                />
                                <div style={styles.privacy}>
                                    {
                                        <Icon style={styles.icon}>
                                            {
                                                privacy === 1 ? (
                                                    <Lock style={styles.icon.inside}/>
                                                ) : (
                                                    <LockOpen style={styles.icon.inside}/>
                                                )
                                            }
                                        </Icon>
                                    }
                                    <HorizontalSelector label={"Visibilité"}
                                                        items={privacySettings}
                                                        itemId={"privacy_setting_id"}
                                                        selectedItem={privacy}
                                                        setSelectedItem={handlePrivacySettingChange}
                                                        isIndex={true}
                                                        defaultValue={1}
                                                        size={"small"}
                                                        value={"name"}
                                                        background={"paper"}
                                    />
                                </div>
                            </div>

                            <TextField
                                id="description"
                                style={styles.description}
                                multiline
                                minRows="3"
                                value={description}
                                onChange={handleDescriptionChange}
                                placeholder="Description"
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 100,
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                    '& .Mui-focused': {
                                        borderRadius: '0.5rem',
                                        background: theme.palette.background.paper,
                                    },
                                }}
                            />
                            <div style={{
                                ...styles.horizontalContainer,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div>
                                    <GameSearch
                                        onSelect={addGame}
                                        textPadding="1rem"
                                        searchWidth="30rem"
                                        searchHeight="auto"
                                        placeholder="Ajouter un jeu"
                                        resultsHeight="20rem"
                                    />
                                </div>
                                <div style={styles.actionButtons}>
                                    <Button
                                        onClick={cancelEdit}
                                        sx={{
                                            ...styles.cancelButton,
                                            '&:hover': {
                                                ...styles.cancelButton.hover
                                            }
                                        }}
                                    >
                                        Annuler les modifications
                                    </Button>
                                    <Button
                                        onClick={saveEdit}
                                        sx={{
                                            ...styles.saveButton,
                                            '&:hover': {
                                                ...styles.saveButton.hover
                                            }
                                        }}
                                    >
                                        Valider les modifications
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div style={styles.gamesContainer}>
                            <p>
                                {collectionContent.length} jeux
                            </p>
                            <Divider sx={{...styles.divider}} flexItem/>
                            <Grid2 container spacing={'2rem'} justifyContent="center" marginTop={'2rem'}>
                                {collectionContent.map((game, index) => {
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
                        </div>

                    </div>
                )}
        < /Box>
    )
}

const getStyles = (theme, isMobile) => {
    const horizontalContainer = {
        display: 'flex',
        flexDirection: 'row'
    }

    const inputField = {
        borderRadius: '0.5rem',
        boxShadow: `0 0 0.2rem ${theme.palette.text.primary}`,
        maxWidth: '100%'
    }

    const actionButton = {
        padding: ' 1rem',
        borderRadius: '0.5rem',
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
        transition: 'background-color 0.3s, transform 0.2s',
        boxShadow: `0 0 0.25rem ${theme.palette.transparentColors['black-50']}`,
        border: '0.2rem solid',
    }

    return {
        breadcrumbs: {
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.colors.red,
            margin: "2em 0 1em 2em",
        },
        breadcrumb: {
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.colors.red,
        },
        container: {
            display: 'flex',
            flexDirection: 'column',
            paddingBlock: '2.5rem',
            paddingInline: isMobile ? '1rem' : '5rem',
            gap: '2rem'
        },
        informationsContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
        },
        horizontalContainer: {
            ...horizontalContainer,
            gap: '5rem',
        },
        name: {
            ...inputField,
            width: '50rem'
        },
        description: {
            ...inputField
        },
        privacy: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '1rem',
        },
        icon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '2rem',
            width: '2rem',
            inside: {
                height: '100%',
                width: '100%',
            },
        },
        actionButtons: {
            ...horizontalContainer,
            justifyContent: 'flex-end',
            gap: '2rem'
        },
        cancelButton: {
            ...actionButton,
            borderColor:
            theme.palette.colors.red,
            hover:
                {
                    backgroundColor: theme.palette.colors.red,
                    color:
                    theme.palette.text.contrast,
                    borderColor:
                        'transparent',
                }
        },
        saveButton: {
            ...actionButton,
            borderColor: theme.palette.colors.green,
            hover: {
                backgroundColor: theme.palette.colors.green,
                color: theme.palette.text.contrast,
                borderColor: 'transparent',
            }
        },
        divider: {
            borderColor: theme.palette.text.primary,
            borderBottomWidth:
                '0.1rem'
        },
        gamesContainer: {
            paddingBlock: '1rem',
            paddingInline: isMobile ? '1rem' : '2rem',
        },
    }
}

export default CollectionEditPage