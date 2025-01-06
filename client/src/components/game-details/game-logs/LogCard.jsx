import React, {useState, useEffect} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, Tooltip} from "@mui/material"
import {useTheme} from "@mui/material/styles"


function LogCard({logData}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const [error, setError] = useState(null)

    const [data, setData] = useState([])

    /*useEffect(() => {
        (async () => {
            try {
                const response = await fetch(fetchUrl)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setData(data.data)
            } catch (err) {
                console.error('Erreur lors de la récupération des données :', err)
                setError('Impossible de charger les données.')
            }
        })()
    }, [fetchUrl])*/

    if (error) return <div>{error}</div>

    return (
        <div style={styles.container}>
            <img src="https://via.placeholder.com/270x480" height="100%"/>
            <div style={styles.infos}>
                <p>Cyberpunk 2077</p>
                <p>Journal 1</p>
                <div style={styles.timeAndPlatform}>
                    <p>Journal 1</p>
                    <p>Steam</p>
                </div>
            </div>
        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        display:'flex',
        flexDirection:'row',
        background: theme.palette.background.paper,
        boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
        borderRadius: '1rem',
        height: '20rem',
        width: '25rem',
        overflow: 'hidden',
    },
    infos:{
        display:'flex',
        flexDirection:'column',
        height: '100%',
        width: '100%',
    },
    timeAndPlatform:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    },
})

export default LogCard