import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../components/AuthContext.jsx';
import {Box, Breadcrumbs, Link as MuiLink, CircularProgress, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {NavLink, useParams} from "react-router-dom";
import {ArrowForward, NavigateNext} from "@mui/icons-material";
import {Link} from 'react-router-dom';

function CollectionEditPage() {
    const {user, token} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)

    const {id} = useParams()
    const [collection, setCollection] = useState({})
    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch(`http://localhost:8080/game-collections/collection/${id}`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            setCollection(data.data)
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

                    </div>
                )}
        < /Box>
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
        container: {
            paddingBlock: '2.5rem',
            paddingInline: isMobile ? '1rem' : '5rem',
        },
    }
}

export default CollectionEditPage