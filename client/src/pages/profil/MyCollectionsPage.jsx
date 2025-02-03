import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';
import {Box, CircularProgress, Grid2, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import CollectionCard from "../../components/profile/collections/CollectionCard.jsx";
import NewCollectionForm from "../../components/profile/collections/NewCollectionForm.jsx";

const MyCollectionsPage = () => {
    const {user} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)

    const [updateCollections, setUpdateCollections] = useState(false)

    const [collections, setCollections] = useState()

    async function fetchData() {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:8080/game-collections/user/${user.id}`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            setCollections(data.data)
            setLoading(false)
        } catch (e) {
            setError(e)
        }
    }

    async function saveCollectionCreation(body) {
        try {
            const response = await fetch(`http://localhost:8080/game-collections/create/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error(`Failed to create collection : ${response.statusText}`)
            }

            await response.json()
        } catch (error) {
            console.error('Error create new collection :', error)
        }
    }

    async function saveCollectionDeletion(collectionId) {
        try {
            const response = await fetch(`http://localhost:8080/game-collections/delete/${collectionId}`, {
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

    useEffect(() => {
        try {
            fetchData()
        } catch (e) {
            console.error('Erreur lors de la récupération des journaux :', e)
            setLoading(false)
        }
    }, [updateCollections]);

    const [isCollectionFormOpen, setCollectionFormOpen] = useState(false);

    const openCollectionForm = () => {
        setCollectionFormOpen(true)
    }

    const closeCollectionForm = () => {
        setCollectionFormOpen(false)
    }

    const createCollection = async (newCollection) => {
        await saveCollectionCreation(newCollection)
        setUpdateCollections(!updateCollections)
        closeCollectionForm()
    }

    const createCollectionAndChange = async (newCollection) => {
        await createCollection(newCollection)
        // redirect to collection page
    }

    const cancelCollectionCreation = () => {
        closeCollectionForm()
    }

    const deleteCollection = async (game_collection_id) => {
        if (confirm('Voulez-vous vraiment supprime cette collection ?')) {
            await saveCollectionDeletion(game_collection_id)
            setUpdateCollections(!updateCollections)
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
            <Typography variant="subtitle2" style={styles.breadcrumb}>
                Profil &gt; Collections
            </Typography>

            <div style={styles.container}>
                <div style={styles.options}>
                    {/*<Typography fontSize={"large"}>Trier par</Typography>
                        <FormControl style={styles.sortingOptionForm}>
                            <Select
                                style={styles.sortingOptionSelector}
                                id="sort-selector"
                                value={sortingOption}
                                size={"small"}
                                variant="outlined"
                                onChange={(e) => handleSortingOptionChange(Number(e.target.value))}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                            >
                                {
                                    sortingOptions && sortingOptions.map((item, index) => (
                                        <MenuItem key={index} value={index}>
                                            {item.label}
                                        </MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                        <IconButton
                            disableTouchRipple
                            onClick={() => handleSortingOrderChange(!sortingOrder)}
                            style={styles.sortingButton}
                            sx={{
                                '&:hover': {
                                    background: 'none',
                                    transform: 'scale(1.2)',
                                },
                                '&:active': {
                                    transform: 'scale(1)',
                                },
                            }}
                        >
                            {sortingOrder ? (
                                <VerticalAlignBottom fontSize="large"></VerticalAlignBottom>
                            ) : (
                                <VerticalAlignTop fontSize="large"></VerticalAlignTop>
                            )}
                        </IconButton>*/}
                    <NewCollectionForm
                        isCollectionFormOpen={isCollectionFormOpen}
                        openCollectionForm={openCollectionForm}
                        closeCollectionForm={closeCollectionForm}
                        createCollection={createCollection}
                        createCollectionAndChange={createCollectionAndChange}
                        cancelCollectionCreation={cancelCollectionCreation}
                    />
                </div>

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
                        <div style={styles.collectionsContainer}>
                            {
                                collections?.length === 0 ? (
                                    <Typography style={styles.noCollections}>
                                        Vous n'avez aucune collection.
                                    </Typography>
                                ) : (
                                    <Grid2 container spacing={'2rem'} justifyContent="center">
                                        {collections.map((item, index) => {
                                                return (
                                                    <Box key={index}>
                                                        <CollectionCard
                                                            collectionData={item}
                                                            deleteCollection={deleteCollection}
                                                        />
                                                    </Box>
                                                )
                                            }
                                        )}
                                    </Grid2>
                                )
                            }
                        </div>
                    )}
            </div>
        </Box>
    )
}

const getStyles = (theme, isMobile) => {
    return {
        breadcrumb: {
            color: theme.palette.colors.red,
            padding: isMobile ? "0.75em 0 0 0.75em" : "1.5em 0 0 1.5em",
            font: 'Inter',
            fontSize: isMobile ? "0.9em" : "1em",
        },
        error: {
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '4rem',
        },
        noCollections: {
            flex: '1',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '2rem',
        },
        options: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            gap: '1rem',
        },
        container: {
            paddingBlock: '2.5rem',
            paddingInline: isMobile ? '1rem' : '5rem',
            display: 'flex',
            flexDirection: 'column',
            flex: '1'
        },
        collectionsContainer: {
            paddingBlock: '2.5rem',
            paddingInline: '0rem',
        },
        icon: {
            height: '30rem',
            width: '30rem',
            inside: {
                height: '100%',
                width: '100%',
            },
        },
    }
}

export default MyCollectionsPage;
