import React, {useEffect, useState} from "react"
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from "rehype-sanitize"
import {useTheme} from "@mui/material/styles"
import PlaytimeSetter from "./log-details-content/PlaytimeSetter.jsx"
import {TextField, useMediaQuery} from "@mui/material"

function SessionEditor({
                           session,
                           sessionContent, setSessionContent, saveSessionContent,
                           sessionTitle, setSessionTitle, saveSessionTitle,
                           saveSessionPlaytime,
                           collapseButtonSize
                       }) {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, collapseButtonSize, isMobile)

    useEffect(() => {
        setSessionTitle(session.title)
        if (session.time_played !== 0) {
            setHours(session.time_played >= 60 ? Math.floor(session.time_played / 60) : '')
            setMinutes(session.time_played % 60)
        } else {
            setHours('')
            setMinutes('')
        }
    }, [session])

    const [hours, setHours] = useState('')
    const handleHoursChange = (event) => {
        const time = Number(event.target.value)
        setHours(time !== 0 ? Number(event.target.value) : '')
    }

    const [minutes, setMinutes] = useState('')
    const handleMinutesChange = (event) => {
        setMinutes(Number(event.target.value))
    }

    const handleSessionContentChange = (value) => {
        setSessionContent(value)
    }

    const handleSessionContentSave = () => {
        saveSessionContent()
    }

    const handleTitleChange = (event) => {
        setSessionTitle(event.target.value)
    }

    const handleSessionTitleSave = () => {
        saveSessionTitle()
    }

    const handleSessionPlaytimeSave = () => {
        const newPlaytime = Number(hours) * 60 + Number(minutes)
        saveSessionPlaytime(newPlaytime)
    }

    if (session === -1) return (
        <div style={styles.noSession}>
            <p>Choisissez une session</p>
        </div>
    )

    return (
        <div style={{
            ...styles.container,
            ...styles.mobile.container,
        }}
             data-color-mode={theme.palette.mode}
        >
            <div style={{
                ...styles.sessionInformations,
                ...(isMobile ? styles.mobile.sessionInformations : {}),
            }}>
                <TextField
                    style={styles.title}
                    id="title"
                    value={sessionTitle || ''}
                    onChange={handleTitleChange}
                    onBlur={handleSessionTitleSave}
                    placeholder="Titre de la session"
                    slotProps={{
                        htmlInput: {
                            style: {
                                fontSize: (isMobile ? '1.5rem' : '2rem'),
                                fontWeight: 'bold',
                                padding: '0.25rem 0.5rem',
                            }
                        },
                    }}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                />

                <div style={{
                    ...(isMobile ? styles.mobile.playtime : {}),
                }}>
                    <PlaytimeSetter
                        hours={hours}
                        setHours={handleHoursChange}
                        minutes={minutes}
                        setMinutes={handleMinutesChange}
                        savePlaytime={handleSessionPlaytimeSave}
                        timeCalculationMethod={-1}
                    />
                </div>
            </div>

            <MDEditor
                style={styles.editor}
                value={sessionContent}
                onChange={handleSessionContentChange}
                onBlur={handleSessionContentSave}
                commands={[]}
                visibleDragbar={false}
                toolbarBottom
                preview="live"
                height={'100%'}
                textareaProps={{
                    placeholder: 'Informations de la session',
                }}
                previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                }}
            />
        </div>
    )
}

const getStyles = (theme, collapseButtonSize, isMobile) => ({
    noSession: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        padding: '1.5rem 0',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    title: {
        width: '100%',
    },
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    sessionInformations: {
        display: 'flex',
        maxWidth: '100%',
        marginRight: (isMobile ? '0.5rem' : '2rem'),
        flexDirection: 'row',
        height: `${2 * collapseButtonSize + 2}rem`,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `1rem 0  1rem ${collapseButtonSize + (isMobile ? 0 : 1)}rem`
    },
    editor: {
        borderRadius: '0',
        width: '100%',
    },
    mobile: {
        playtime: {
            alignSelf: 'end',
        },
        sessionInformations: {
            flexDirection: 'column',
        },
    },
})

export default SessionEditor