import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../components/AuthContext.jsx';
import {Box, CircularProgress, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useParams} from "react-router-dom";

function CollectionPage() {
    const {user, token} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)

    const {id} = useParams()
    const [collection, setCollection] = useState(null)

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:8080/game-collections/collection/${id}`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            setCollection(data.data)
        } catch (err) {
            console.error('Erreur lors de la récupération de la collection :', err)
            setError('Impossible de charger la collection.')
        } finally {
            setLoading(false);
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
                    <div>
                    </div>
                )}
        < /Box>
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
    }
}

export default CollectionPage;