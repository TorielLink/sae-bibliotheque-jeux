import React, {useState, useEffect} from 'react'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    IconButton,
    TextField,
    useMediaQuery
} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import HorizontalSelector from "../../game-details/game-logs/log-details-content/HorizontalSelector.jsx"
import {AddBox, EditNote, Lock, LockOpen} from "@mui/icons-material"

function NewCollectionForm({
                               isCollectionFormOpen,
                               openCollectionForm,
                               closeCollectionForm,
                               createCollection,
                               createCollectionAndEdit,
                               cancelCollectionCreation,
                               collections
                           }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)
    const [loading, setLoading] = useState(true)

    const [privacySettings, setPrivacySettings] = useState()

    async function fetchData() {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:8080/privacy-settings`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
            const data = await response.json()
            setPrivacySettings(data.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchData()
        setName("")
        setDescription("")
    }, [collections])

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

    const handleCreateCollection = async () => {
        await createCollection({
            name: name,
            description: description,
            privacy: privacy
        })
        closeCollectionForm()
    }

    const handleCreateCollectionAndEdit = async () => {
        return await createCollectionAndEdit({
            name: name,
            description: description,
            privacy: privacy
        })
    }

    return (
        !loading && (
            <div>
                {/*<IconButton
                    disableTouchRipple
                    onClick={editCollection}
                    sx={{
                        ...styles.editCollectionButton,
                        '&:hover': {
                            ...styles.editCollectionButton.hover
                        }
                    }}
                >
                    <p>Modifier la collection</p>
                    <EditNote fontSize="large"/>
                </IconButton>*/}
                <IconButton
                    disableTouchRipple
                    onClick={openCollectionForm}
                    sx={{
                        ...styles.openDialogButton,
                        '&:hover': {
                            ...styles.openDialogButton.hover
                        }
                    }}
                >
                    <AddBox fontSize="large"/>
                    <p>Créer une collection</p>
                </IconButton>

                <Dialog
                    sx={{
                        '& .MuiPaper-root': {
                            borderRadius: '1rem',
                            background: theme.palette.background.paper,
                        },
                    }}
                    open={isCollectionFormOpen}
                    onClose={closeCollectionForm}
                    aria-labelledby="create-collection-dialog-title"
                    aria-describedby="create-collection-dialog-description"
                >

                    <DialogTitle id="create-collection-dialog-title" fontWeight="bold"
                                 style={styles.dialogTitle}>
                        Nouvelle collection
                    </DialogTitle>

                    <DialogContent style={styles.container}>

                        <TextField
                            id="name"
                            style={styles.inputField}
                            value={name}
                            onChange={handleNameChange}
                            placeholder="Nom de la collection"
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
                                    background: theme.palette.background.default,
                                },
                            }}
                        />

                        <TextField
                            id="description"
                            style={styles.inputField}
                            multiline
                            minRows="3"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Description de la collection"
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
                                    background: theme.palette.background.default,
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

                    </DialogContent>

                    <DialogActions style={styles.dialogActions}>
                        <Button style={styles.submitButton} onClick={handleCreateCollectionAndEdit} sx={{
                            '&:hover': {
                                transform: 'scale(1.025)',
                            },
                            '&:active': {
                                transform: 'scale(1)',
                            },
                        }}>
                            Valider et modifier
                        </Button>
                        <Button style={styles.submitButton} onClick={handleCreateCollection} sx={{
                            '&:hover': {
                                transform: 'scale(1.025)',
                            },
                            '&:active': {
                                transform: 'scale(1)',
                            },
                        }}>
                            Valider
                        </Button>
                        <Button style={styles.cancelButton} onClick={cancelCollectionCreation} sx={{
                            '&:hover': {
                                transform: 'scale(1.025)',
                            },
                            '&:active': {
                                transform: 'scale(1)',
                            },
                        }}>
                            Fermer
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
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

    const actionButton = {
        padding: '0 1rem',
        borderRadius: '1rem',
        fontSize: '1rem',
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
        transition: 'background-color 0.3s, transform 0.2s',
        boxShadow: `0 0 0.25rem ${theme.palette.transparentColors['black-50']}`,
        border: '0.2rem solid',
    }

    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1rem',
        },
        openDialogButton: {
            ...actionButton,
            borderColor: theme.palette.colors.green,
            hover: {
                backgroundColor: theme.palette.colors.green,
                color: theme.palette.text.contrast,
                borderColor: 'transparent',
            }
        },
        dialogTitle: {
            boxShadow: `0 0 0.2rem ${theme.palette.colors.black}`,
            width: '100%',
        },
        dialogActions: {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '0.5rem' : '0.2rem',
        },
        inputField: {
            borderRadius: '0.5rem',
            boxShadow: `0 0 0.2rem ${theme.palette.colors.black}`,
            width: '31rem',
            maxWidth: '100%'
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

export default NewCollectionForm