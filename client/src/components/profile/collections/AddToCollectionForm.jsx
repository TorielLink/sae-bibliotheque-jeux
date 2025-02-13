import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../AuthContext.jsx';
import {
    Box, Button,
    Checkbox,
    CircularProgress, Dialog, DialogActions, DialogContent,
    DialogTitle,
    FormControlLabel,
    FormGroup, Typography,
    useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";

function AddToCollectionForm({gameId, open, onClose, alertState, setAlertState}) {
    const {user} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)

    const [collections, setCollections] = useState([])
    const [originalSelectedCollections, setOriginalSelectedCollections] = useState()
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:8080/game-collections/user/${user.id}`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            setCollections(data.data)

            const collectionsIds = data.data.flatMap(collection => {
                if (collection.collection_content.find(game => game.id === gameId)) {
                    return collection.game_collection_id
                }
                return []
            })
            setOriginalSelectedCollections(collectionsIds)
            setSelectedCollections(collectionsIds)

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

    const [selectedCollections, setSelectedCollections] = useState([])
    const handleSelect = (collectionId) => {
        if (selectedCollections.includes(collectionId)) {
            setSelectedCollections(selectedCollections.filter(collection => collection !== collectionId))
        } else {
            setSelectedCollections([...selectedCollections, collectionId])
        }
    }

    const handleSelectAll = () => {
        if (collections.length === selectedCollections.length) {
            setSelectedCollections([])
        } else {
            console.log(collections.map(collection => collection.game_collection_id))
            setSelectedCollections(collections.map(collection => collection.game_collection_id))
        }
    }

    const addToCollections = async () => {
        try {
            const response = await fetch(`http://localhost:8080/collection-content/update-collections/game/${gameId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({collectionsIds: selectedCollections}),
            })

            if (response.status / 300 < 1) {
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
                setSelectedCollections(originalSelectedCollections)
            }
            console.log((await response.json()).message)
        } catch (error) {
            console.error('Erreur lors de la récupération  :', error.message)
        }
    }
    const closeAlert = () => {
        setSelectedCollections(originalSelectedCollections)
        onClose()
    }
    return (
        <Dialog
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '1rem',
                    background: theme.palette.background.paper,
                },
            }}
            open={open}
            onClose={onClose}
            aria-labelledby="add-to-collection-dialog-title"
            aria-describedby="add-to-collection-dialog-description"
        >
            <DialogTitle id="add-to-collection-dialog-title" fontWeight="bold"
                         style={styles.dialogTitle}>
                Ajouter à une collection
            </DialogTitle>
            {
                loading ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flex: '1',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '1rem'
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
                    <DialogContent>
                        <FormControlLabel
                            control={<Checkbox/>}
                            onChange={handleSelectAll}
                            checked={selectedCollections.length === collections.length}
                            label="Tout sélectionner"
                        />
                        <FormGroup sx={{
                            marginLeft: '1rem',
                        }}>
                            {
                                collections && collections.map(collection => (
                                        <Box key={collection.game_collection_id}>
                                            <FormControlLabel
                                                control={<Checkbox/>}
                                                onChange={() => handleSelect(collection.game_collection_id)}
                                                checked={selectedCollections.includes(collection.game_collection_id)}
                                                label={collection.name}/>
                                        </Box>
                                    )
                                )
                            }
                        </FormGroup>
                    </DialogContent>

                )
            }
            <DialogActions style={styles.dialogActions}>
                <Button style={styles.submitButton} onClick={() => addToCollections(selectedCollections)} sx={{
                    '&:hover': {
                        transform: 'scale(1.025)',
                    },
                    '&:active': {
                        transform: 'scale(1)',
                    },
                }}>
                    Valider
                </Button>
                <Button style={styles.cancelButton} onClick={closeAlert} sx={{
                    '&:hover': {
                        transform: 'scale(1.025)',
                    },
                    '&:active': {
                        transform: 'scale(1)',
                    },
                }}>
                    Annuler
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const getStyles = (theme, isMobile) => {
    const formButton = {
        color: theme.palette.text.primary,
        fontWeight: 'bold',
        padding: '0.5rem 1rem',
        boxShadow: `0 0 0.1rem ${theme.palette.colors.black}`,
        borderRadius: '0.5rem',
    }

    return {
        dialogTitle: {
            boxShadow: `0 0 0.2rem ${theme.palette.colors.black}`,
            width: '100%',
        },
        dialogActions: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '0.5rem' : '0.2rem',
        },
        submitButton: {
            ...formButton,
            background: theme.palette.colors.green,
        },
        cancelButton: {
            ...formButton,
            background: theme.palette.colors.red,
        },
    }
}

export default AddToCollectionForm;