import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';
import {Box, CircularProgress, Typography} from "@mui/material";

const MyCollectionsPage = () => {
    const {user, token} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)


    return (
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
            <Box
                sx={{
                    display: 'flex',
                    flex: '1',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

            </Box>
        )
    )
}

export default MyCollectionsPage;
