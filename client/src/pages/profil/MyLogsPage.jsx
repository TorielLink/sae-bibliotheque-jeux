import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';
import {
    Box,
    CircularProgress,
    FormControl,
    FormControlLabel,
    Grid2,
    IconButton,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Typography,
    useMediaQuery
} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {VerticalAlignBottom, VerticalAlignTop} from "@mui/icons-material";
import LogCard from "../../components/game-details/game-logs/LogCard.jsx";

const MyLogsPage = () => {
    const {user} = useContext(AuthContext)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile)

    const [logs, setLogs] = useState([])
    const [games, setGames] = useState([])
    const [sessions, setSessions] = useState([])

    useEffect(() => {
        setError(null)
    }, [logs]);

    async function fetchData() {
        console.log("--------------------------RELOAD--------------------------")
        try {
            setLoading(true)
            let response = await fetch(`http://localhost:8080/game-logs/user/${user.id}`)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            let data = await response.json()
            const tempLogs = data.data
            if (tempLogs.length !== 0) {

                const logIds = []
                const gameIds = []
                tempLogs.forEach((log) => {
                    gameIds.push(log.igdb_game_id)
                    logIds.push(log.game_log_id)
                })


                response = await fetch('http://localhost:8080/games/specific', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        gameIds: gameIds,
                    }),
                })

                data = await response.json()
                const tempGames = data
                setGames(tempGames)

                response = await fetch('http://localhost:8080/game-sessions/logs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        logIds: logIds,
                    }),
                })

                data = await response.json()
                const tempSessions = data.data
                sortLogs(enhanceLogs(tempLogs, tempGames, tempSessions), 0, false)
            } else {
                setGames([])
                setSessions([])
            }
            setLoading(false)
        } catch (e) {
            setError(e)
        }
    }

    function enhanceLogs(logs, games, sessions) {
        const enhancedLogs = logs.map((log) => {
            let gameName;
            games.forEach((game) => {
                if (game.id === log.igdb_game_id)
                    gameName = game.name
            })

            let logSessions = []
            sessions.forEach((session) => {
                if (session.game_log_id === log.game_log_id)
                    logSessions.push(session)
            })

            const latestSessionDate = logSessions.reduce((latest, session) => {
                const sessionDate = new Date(session.session_date)
                return sessionDate > latest ? sessionDate : latest
            }, new Date(0))

            return {
                ...log,
                game_name: gameName,
                sessions: logSessions,
                latest_session_date: latestSessionDate.toISOString(),
            }
        })
        return enhancedLogs
    }

    function sortLogs(logs, sortingOption, sortingOrder, returns) {
        const selectedOption = sortingOptions[sortingOption];

        const sortedLogs = [...logs].sort((a, b) => {
            const aValue =
                selectedOption?.mainId === "latest_session_date"
                    ? new Date(a[selectedOption.mainId])
                    : selectedOption?.secondaryId
                        ? a[selectedOption.mainId][selectedOption.secondaryId]
                        : a[selectedOption.mainId]

            const bValue =
                selectedOption?.mainId === "latest_session_date"
                    ? new Date(b[selectedOption.mainId])
                    : selectedOption?.secondaryId
                        ? b[selectedOption.mainId][selectedOption.secondaryId]
                        : b[selectedOption.mainId]

            if (aValue < bValue) return sortingOrder ? -1 : 1
            if (aValue > bValue) return sortingOrder ? 1 : -1
            return 0
        });

        setLogs(sortedLogs)
    }

    useEffect(() => {
        try {
            fetchData()
        } catch (e) {
            console.error('Erreur lors de la récupération des journaux :', e)
            setLoading(false)
        }
    }, [])

    const sortingOptions = [
        {label: "Denière session", defaultOrder: false, mainId: "latest_session_date"},
        {label: "Nombre de session", defaultOrder: false, mainId: "sessions", secondaryId: "length"},
        {label: "Temps de jeu", defaultOrder: false, mainId: "time_played"},
        {label: "Jeu", defaultOrder: true, mainId: "game_name"},
        {label: "Plateforme", defaultOrder: true, mainId: "platform", secondaryId: 'platform_id'},
    ]

    const [sortingOption, setSortingOption] = useState(0)

    function handleSortingOptionChange(newValue) {
        setSortingOption(newValue)
        setSortingOrder(sortingOptions[newValue].defaultOrder)
    }

    // true : ascendant - false : descendant
    const [sortingOrder, setSortingOrder] = useState(false)

    function handleSortingOrderChange(newValue) {
        setSortingOrder(newValue)
    }

    useEffect(() => {
        sortLogs(logs, sortingOption, sortingOrder)
    }, [sortingOption, sortingOrder])

    const viewModes = [
        // {label: "details", icon: <Window/>},
        // {label: "list", icon: <FormatListBulletedIcon/>},
        // {label: "grid", icon: <Window/>},
    ]
    const [viewMode, setViewMode] = useState(0)

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
            <>
                <Typography variant="subtitle2" style={styles.breadcrumb}>
                    Profil &gt; Journaux
                </Typography>

                <div style={styles.container}>
                    <div style={{
                        ...styles.sortingOptions,
                        // border: 'solid 1px red',
                    }}>
                        <Typography fontSize={"large"}>Trier par</Typography>
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
                        </IconButton>
                    </div>
                    {/*
                    <div style={styles.viewModes}>
                        <RadioGroup
                            row
                            value={viewMode}
                            onChange={(event) => setViewMode(Number(event.target.value))}
                        >
                            <FormControl fullWidth>
                                Utiliser le margin des FormControlLabel pour changer l'espacement
                                <Grid2 container spacing={0} justifyContent="center">
                                    {viewModes.map((item, index) => {
                                        return (
                                            <Grid2 key={index}>
                                                <FormControlLabel
                                                    value={viewMode}
                                                    label={index}
                                                    style={styles.viewModeControlLabel}
                                                    control={
                                                        <Radio
                                                            checkedIcon={item.icon}
                                                            icon={item.icon}
                                                            value={index}
                                                            checked={viewMode === index}
                                                            disableTouchRipple
                                                            style={styles.viewModeButton}
                                                            sx={{
                                                                borderRadius: `${index === 0 ? '1rem 0rem 0rem 1rem' : index === viewModes.length - 1 ? '0rem 1rem 1rem 0rem' : '0'}`,
                                                                '&.Mui-checked': {
                                                                    background: theme.palette.background.default,
                                                                }
                                                            }}
                                                        />
                                                    }
                                                />
                                            </Grid2>
                                        )
                                    })}
                                </Grid2>
                            </FormControl>
                        </RadioGroup>
                    </div>
                    */}

                    <div style={styles.logsContainer}>
                        {
                            logs.length === 0 ? (
                                <Typography style={styles.noLogs}>Vous n'avez aucun journal. Allez sur la page d'un jeu
                                    afin
                                    d'en créer un.</Typography>
                            ) : (
                                <Grid2 container spacing={'2rem'} justifyContent="center">
                                    {logs.map((item, index) => {
                                            return (
                                                <Box key={index}>
                                                    <LogCard
                                                        gameData={games.find((game) => game.id === item.igdb_game_id)}
                                                        logData={item}
                                                    />
                                                </Box>
                                            )
                                        }
                                    )}
                                </Grid2>)
                        }
                    < /div>

                </div>
            </>
        )
    )
}

const getStyles = (theme, isMobile) => ({
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
    noLogs: {
        flex: '1',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: '2rem',
    },
    container: {
        paddingBlock: '2.5rem',
        paddingInline: '5rem',
        flex: '1'
    },
    displayOptions: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    sortingOptions: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
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
    viewModes: {
        borderRadius: '1rem',
        background: theme.palette.background.paper,
        overflow: 'hidden',
        boxShadow: `0 0 0.25rem ${theme.palette.colors.black}`,
    },
    viewModeControlLabel: {
        margin: '0',
    },
    viewModeButton: {
        color: theme.palette.text.primary
    },
    logsContainer: {
        paddingBlock: '2.5rem',
        paddingInline: '0rem',
    },
})

export default MyLogsPage
