import React, {useState, useEffect} from 'react'
import {
    Box,
    CircularProgress,
    Typography,
    useMediaQuery,
    TextField,
    Icon, Button, Divider, Grid2, Alert, Snackbar, IconButton
} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {useNavigate, useParams} from "react-router-dom"
import {Delete, Lock, LockOpen} from "@mui/icons-material"
import HorizontalSelector from "../components/game-details/game-logs/log-details-content/HorizontalSelector.jsx"
import GameSearch from "../components/profile/collections/GameSearch.jsx"
import CollectionGameCard from "../components/profile/collections/CollectionGameCard.jsx"
import CustomBreadcrumbs from "../components/Breadcrumbs.jsx"
import {useTranslation} from "react-i18next";

function CollectionEditPage() {
    const [loading, setLoading] = useState(false)
    const [newGameLoading, setNewGameLoading] = useState(false)
    const [error, setError] = useState(null)
    const {t} = useTranslation();

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
            let collection = storedCollection ? JSON.parse(storedCollection) : null
            if (!collection) {
                const response = await fetch(`http://localhost:8080/game-collections/collection/${id}`)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
                const data = await response.json()
                collection = data.data
            }
            setCollection(collection)

            const response = await fetch(`http://localhost:8080/privacy-settings`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
            const data = await response.json()
            setPrivacySettings(data.data)
        } catch (err) {
            console.error('Erreur lors de la récupération des données :', err)
            setError(t("error.errorData"))
        } finally {
            setLoading(false)
        }
    }

    const fetchGameData = async (gameId) => {
        try {
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
            return data[0]
        } catch (error) {
            console.error('Erreur lors de la récupération  :', error.message)
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

    useEffect(() => {
        setNewGameLoading(false)
    }, [collectionContent])

    const [alertState, setAlertState] = useState({
        alertOpen: false,
        alertMessage: "",
        vertical: 'bottom',
        horizontal: 'center',
    })
    const {vertical, horizontal, alertOpen, alertMessage} = alertState

    const addGame = async (gameId) => {
        if (collectionContent.find(game => game.id === gameId)) {
            setAlertState({
                ...alertState,
                alertOpen: true,
                message: t("collectionEditPage.alreadyExistGame")
            })
            return
        }

        setNewGameLoading(true)
        const game = await fetchGameData(gameId)
        setCollectionContent([...collectionContent, game])
    }

    const removeGame = (gameId) => {
        setCollectionContent([...collectionContent.filter(game => game.id !== gameId)])
    }

    const cancelEdit = () => {
        navigate(`/collection/${id}`)
    }

    const saveData = async (newCollection) => {
        try {
            const response = await fetch(`http://localhost:8080/game-collections/update/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCollection),
            })
            const data = await response.json()
            return data.data
        } catch (error) {
            console.error('Erreur lors de la récupération  :', error.message)
        }
    }

    const [savingEdit, setSavingEdit] = useState(false)
    const saveEdit = async () => {
        const newCollection = {
            name: name,
            description: description,
            privacy: privacy,
            newGames: collectionContent
        }
        if (!(newCollection.name === collection.name &&
            newCollection.description === collection.description &&
            newCollection.privacy === collection.privacy_setting_id &&
            newCollection.newGames === collection.collection_content)
        ) {
            setSavingEdit(true)
            newCollection.newGames = collectionContent.map(game => game.id)
            await saveData(newCollection)
            localStorage.removeItem(`collection_${id}`)
            setSavingEdit(false)
        }
        navigate(`/collection/${id}`)
    }

    const handleAlertClose = () => {
        setAlertState({
            ...alertState, alertOpen: false
        })
    }

    const breadcrumbsLinks = [
        {label: 'Profil', to: '/profile'},
        {label: 'Collections', to: '/collections'},
        {label: collection?.name, to: `/collection/${id}`},
        {label: 'Modifier', to: `/collection/${id}/edit`},
    ]

    async function saveCollectionDeletion() {
        try {
            const response = await fetch(`http://localhost:8080/game-collections/delete/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error(`Failed to delete collection : ${response.statusText}`)
            }

            await response.json()
        } catch (error) {
            console.error('Error create new collection :', error)
        }
    }

    const deleteCollection = async () => {
        if (confirm(t("collectionEditPage.confirmDelete"))) {
            await saveCollectionDeletion()
            localStorage.removeItem(`collection_${id}`)
            navigate("/collections")
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
            }}
        >
            <Snackbar
                anchorOrigin={{vertical, horizontal}}
                open={alertOpen}
                autoHideDuration={3000}
                onClose={handleAlertClose}
                key={vertical + horizontal}
            >
                <Alert
                    onClose={handleAlertClose}
                    severity="error"
                    variant="filled"
                    sx={{width: '100%'}}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

            <CustomBreadcrumbs
                links={breadcrumbsLinks}
                disabled={savingEdit}
            />
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
                        <Typography color="error" style={styles.error}>{t("collectionEditPage.error")}</Typography>
                    </Box>
                ) : (
                    <div style={styles.container}>
                        <Box style={styles.informationsContainer}>
                            <div style={{
                                ...styles.horizontalContainer,
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div style={styles.horizontalContainer}>
                                    <TextField
                                        id="name"
                                        style={styles.name}
                                        value={name}
                                        onChange={handleNameChange}
                                        placeholder="Nom"
                                        disabled={savingEdit}
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
                                                            value={"name"}
                                                            background={"default"}
                                                            disabled={savingEdit}
                                        />
                                    </div>
                                </div>

                                <IconButton
                                    disableTouchRipple
                                    onClick={deleteCollection}
                                    style={styles.deleteButton}
                                    sx={{
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                        },
                                        '&:active': {
                                            transform: 'scale(1)',
                                        },
                                    }}>
                                    <Delete fontSize="large"/>
                                </IconButton>
                            </div>

                            <TextField
                                id="description"
                                style={styles.description}
                                multiline
                                minRows="3"
                                value={description}
                                onChange={handleDescriptionChange}
                                placeholder={t("collectionEditPage.description")}
                                disabled={savingEdit}
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
                                        placeholder={t("collectionEditPage.addGame")}
                                        resultsHeight="20rem"
                                        disabled={savingEdit}
                                    />
                                </div>
                                <div style={styles.actionButtons}>
                                    <Button
                                        onClick={cancelEdit}
                                        disabled={savingEdit || newGameLoading}
                                        sx={{
                                            ...styles.cancelButton,
                                            '&:hover': {
                                                ...styles.cancelButton.hover
                                            }
                                        }}
                                    >
                                        {t("collectionEditPage.cancel")}
                                    </Button>
                                    <Button
                                        onClick={saveEdit}
                                        disabled={savingEdit || newGameLoading}
                                        sx={{
                                            ...styles.saveButton,
                                            '&:hover': {
                                                ...styles.saveButton.hover
                                            }
                                        }}
                                    >
                                        {t("collectionEditPage.confirm")}
                                        {savingEdit && (
                                            <CircularProgress
                                                size={'1.5rem'}
                                                sx={{
                                                    marginLeft: '1rem',
                                                }}
                                            />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </Box>
                        <div style={styles.gamesContainer}>
                            <p>
                                {collectionContent.length} {collectionContent.length > 1 ? 'jeux' : 'jeu'}
                            </p>
                            <Divider sx={{...styles.divider}} flexItem/>
                            <Grid2 container spacing={'2rem'} justifyContent="center" marginTop={'2rem'}>
                                {collectionContent.map((game) => {
                                    return (
                                        <Box key={game.id}>
                                            <CollectionGameCard
                                                gameData={game}
                                                removeGame={removeGame}
                                            />
                                        </Box>
                                    )
                                })}
                                {newGameLoading && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            width: "13em",
                                            height: "20em",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <CircularProgress/>
                                    </Box>
                                )}
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
        borderRadius: '1rem',
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
        deleteButton: {
            borderRadius: '0.5rem',
            color: theme.palette.background.paper,
            background: theme.palette.colors.red,
            transition: 'transform 0.1s',
        },
    }
}

export default CollectionEditPage