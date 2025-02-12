import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';
import {
    Box, Breadcrumbs,
    CircularProgress,
    Grid2, Link as MuiLink,
    Typography,
    useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import CollectionCard from "../../components/profile/collections/CollectionCard.jsx";
import NewCollectionForm from "../../components/profile/collections/NewCollectionForm.jsx";
import SortingOptions from "../../components/SortingOptions.jsx";
import {NavigateNext} from "@mui/icons-material";
import {Link, useNavigate} from "react-router-dom";
import CustomBreadcrumbs from "../../components/Breadcrumbs.jsx";

const MyCollectionsPage = () => {
    const {user} = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)

    const [updateCollections, setUpdateCollections] = useState(false)

    const [collections, setCollections] = useState([])

    async function fetchData() {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:8080/game-collections/user/${user.id}`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            sortCollections(data.data, 0, true)
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

            return (await response.json()).data
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
            handleSortingOptionChange(0)
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
        if (newCollection.name === "" || newCollection.description === "") {
            if (!confirm('Certains champs sont vide. Voulez vraiment créer la collection ?')) {
                return
            }
        }
        const collection = await saveCollectionCreation(newCollection)
        setUpdateCollections(!updateCollections)
        return collection
    }

    const createCollectionAndChange = async (newCollection) => {
        const result = await createCollection(newCollection)
        navigate(`/collection/${result.game_collection_id}/edit`)
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

    function sortCollections(currentCollections, sortingOption, sortingOrder) {
        const selectedOption = sortingOptions[sortingOption];
        const sortedCollections = [...currentCollections].sort((a, b) => {
            const aValue = selectedOption?.secondaryId
                ? a[selectedOption.mainId][selectedOption.secondaryId]
                : a[selectedOption.mainId]

            const bValue = selectedOption?.secondaryId
                ? b[selectedOption.mainId][selectedOption.secondaryId]
                : b[selectedOption.mainId]

            if (aValue < bValue) return sortingOrder ? -1 : 1
            if (aValue > bValue) return sortingOrder ? 1 : -1
            return 0
        })

        setCollections(sortedCollections)
    }

    const sortingOptions = [
        {label: "Nom", defaultOrder: true, mainId: "name"},
        {label: "Nombre de jeux", defaultOrder: false, mainId: "collection_content", secondaryId: "length"},
        {label: "Visibilité", defaultOrder: true, mainId: "privacy_setting_id"},
    ]

    const [sortingOption, setSortingOption] = useState(0)

    function handleSortingOptionChange(newValue) {
        setSortingOption(newValue)
        setSortingOrder(sortingOptions[newValue].defaultOrder)
    }

    // true : ascendant - false : descendant
    const [sortingOrder, setSortingOrder] = useState(true)

    function handleSortingOrderChange(newValue) {
        setSortingOrder(newValue)
    }

    useEffect(() => {
        sortCollections(collections, sortingOption, sortingOrder)
    }, [sortingOption, sortingOrder])

    const breadcrumbsLinks = [
        {label: 'Profil', to: '/profile'},
        {label: 'Collections', to: '/collections'},
    ]

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flex: '1',
            }}
        >
            <CustomBreadcrumbs
                links={breadcrumbsLinks}
            />

            <div style={styles.container}>
                <div style={styles.options}>
                    <SortingOptions
                        sortingOptions={sortingOptions}
                        sortingOption={sortingOption}
                        handleSortingOptionChange={handleSortingOptionChange}
                        sortingOrder={sortingOrder}
                        handleSortingOrderChange={handleSortingOrderChange}
                    />
                    <div style={styles.newCollectionButton}>
                        <NewCollectionForm
                            isCollectionFormOpen={isCollectionFormOpen}
                            openCollectionForm={openCollectionForm}
                            closeCollectionForm={closeCollectionForm}
                            createCollection={createCollection}
                            createCollectionAndChange={createCollectionAndChange}
                            cancelCollectionCreation={cancelCollectionCreation}
                            collections={collections}
                        />
                    </div>
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

        breadcrumbs: {
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.colors.red,
            margin: "2em 0 1em 2em",
        },
        breadcrumb: {
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.colors.red,
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
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: isMobile ? '2rem' : '1rem',
        },
        sortingOptions: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            gap: '1rem',
        },
        sortingOptionForm: {
            display: 'flex',
            alignItems: 'center',
        },
        sortingOptionSelector: {
            boxShadow: `0 0 0.25em${theme.palette.colors.black}`,
            borderRadius: '1rem',
            background: theme.palette.background.paper,
            fontSize: "large"
        },
        sortingButton: {
            height: '100%',
            padding: '0',
            fontSize: "large",
            transition: 'transform 0.1s',
        },
        newCollectionButton: {
            flexShrink: '0',
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
    }
}

export default MyCollectionsPage;
